<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Notifications\PushTeacherNotification;
use App\Notifications\PushStudentNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type', 'all');
        $publishedOnly = $request->query('published_only') === 'true';

        $query = Notification::query();

        if ($publishedOnly) {
            $query->where('is_published', true);
        }

        if ($type !== 'all') {
            if (!in_array($type, ['student', 'teacher', 'common'])) {
                return response()->json(['message' => 'Invalid type parameter'], 400);
            }
            $query->where('type', $type);
        }

        $notifications = $query->latest()->get();

        return response()->json($notifications);
    }

    public function store(Request $request)
    {
        try {
            Log::info('Received notification store request', $request->all());

            $validated = $request->validate([
                'type' => 'required|in:student,teacher,common',
                'message' => 'required|string',
            ]);

            Log::info('Validated data', $validated);

            // Perform database operations in a transaction
            $notification = DB::transaction(function () use ($validated) {
                $notification = Notification::create($validated);
                Log::info('Notification created', ['id' => $notification->id]);

                if (in_array($validated['type'], ['teacher', 'common'])) {
                    $teacherIds = Teacher::pluck('id');
                    Log::info('Teacher IDs', $teacherIds->toArray());
                    $syncData = [];
                    foreach ($teacherIds as $id) {
                        $syncData[$id] = ['status' => 'unread'];
                    }
                    $notification->teachers()->attach($syncData);//map every teacher_id to unread status
                    Log::info('Teachers attached', $syncData);
                }

                if (in_array($validated['type'], ['student', 'common'])) {
                    $studentIds = Student::pluck('id');
                    Log::info('Student IDs', $studentIds->toArray());
                    $syncData = [];
                    foreach ($studentIds as $id) {
                        $syncData[$id] = ['status' => 'unread'];
                    }
                    $notification->students()->attach($syncData);
                    Log::info('Students attached', $syncData);
                }

                return $notification;
            });

            // Perform notifications outside transaction
            $pushErrors = [];
            if (in_array($validated['type'], ['teacher', 'common'])) {//selects type
                $teachers = Teacher::whereIn('id', Teacher::pluck('id'))->get();//select teachers
                foreach ($teachers as $teacher) {
                    //2conditions - teacher must be a user and that user must have atleast one pushSubscriptions
                    if ($teacher->user && $teacher->user->pushSubscriptions()->exists()) {
                        try {
                            //proceed for the push notification to that teacher user
                            $teacher->user->notify(new PushTeacherNotification($validated['message']));
                            Log::info('Push sent to teacher', ['teacher_id' => $teacher->id]);
                        } catch (\Exception $e) {
                            $pushErrors[] = "Teacher {$teacher->id}: {$e->getMessage()}";//error string
                            Log::error('Failed to send push to teacher', [
                                'teacher_id' => $teacher->id,
                                'error' => $e->getMessage(),
                            ]);
                        }
                    } else {
                        Log::warning('No user or push subscription for teacher', ['teacher_id' => $teacher->id]);
                    }
                }
            }

            if (in_array($validated['type'], ['student', 'common'])) {
                $students = Student::whereIn('id', Student::pluck('id'))->get();
                foreach ($students as $student) {
                    if ($student->user && $student->user->pushSubscriptions()->exists()) {
                        try {
                            $student->user->notify(new PushStudentNotification($validated['message']));
                            Log::info('Push sent to student', ['student_id' => $student->id]);
                        } catch (\Exception $e) {
                            $pushErrors[] = "Student {$student->id}: {$e->getMessage()}";
                            Log::error('Failed to send push to student', [
                                'student_id' => $student->id,
                                'error' => $e->getMessage(),
                            ]);
                        }
                    } else {
                        Log::warning('No user or push subscription for student', ['student_id' => $student->id]);
                    }
                }
            }

            $response = [
                'message' => 'Notification created successfully' . (count($pushErrors) ? ' (some push notifications failed)' : ''),
                'notification' => $notification,
            ];
            if (count($pushErrors)) {
                $response['push_errors'] = $pushErrors;
            }

            return response()->json($response, 201);
        } catch (\Exception $e) {
            Log::error('Error in store notification', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Failed to save notification'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([ //validation
            'message' => 'required|string',
        ]);

        $notification = Notification::findOrFail($id); //find notification id
        $notification->update([
            'message' => $validated['message'], //updation done
        ]);

        return response()->json(['message' => 'Notification updated successfully', 'data' => $notification]);
    }
    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();
        return response()->json(['message' => 'Notification soft deleted successfully']);
    }
    public function publish($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->is_published = !$notification->is_published; //toggle the value
        $notification->save();

        return response()->json([
            'message' => $notification->is_published ? 'Published' : 'Unpublished',
            'data' => $notification
        ]);
    }
    public function userNotifications(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        $notifications = Notification::where('is_published', true) //gets the published notifications
            ->where(function ($query) use ($role) {
                $query->where('type', $role) //get notifications for that role
                    ->orWhere('type', 'common'); //get notifications common
            })
            ->latest()
            ->get();

        return response()->json($notifications);
    }
    public function markNotificationRead(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'teacher') {
            //a checking happens and returns the first matching row
            $teacher = Teacher::where('id', $user->teacher_id)->first();
            $teacher->notification_status = 'read';
            $teacher->save();
        } elseif ($user->role === 'student') {
            $student = Student::where('id', $user->student_id)->first();
            $student->notification_status = 'read';
            $student->save();
        }

        return response()->json(['message' => 'Notification marked as read']);
    }
    //to get teacher's notifications
    public function myNotifications(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'teacher') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $teacher = \App\Models\Teacher::where('user_id', $user->id)->first();

        $notifications = $teacher->notifications()
            ->orderByDesc('notification_teacher.created_at')
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'message' => $notification->message,
                    'status' => $notification->pivot->status, //fetches teacher information from table
                ];
            });

        return response()->json($notifications);
    }
    //make the status of each notification to read
    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role === 'teacher') {
            $teacher = \App\Models\Teacher::where('user_id', $user->id)->first();
            $teacher->notifications()->updateExistingPivot($id, ['status' => 'read']);
        } elseif ($user->role === 'student') {
            $student = \App\Models\Student::where('user_id', $user->id)->first();
            $student->notifications()->updateExistingPivot($id, ['status' => 'read']);
        }

        return response()->json(['message' => 'Notification marked as read.']);
    }
    //get only unread notifications after login
    public function getMyNotificationsWithStatus(Request $request)
    {
        $user = $request->user();
        $role = $user->role;
        $unreadOnly = $request->query('unread_only') === 'true'; // check if unread_only=true

        if ($role === 'teacher') { //checks for the logged_in user in the db
            $teacher = \App\Models\Teacher::where('user_id', $user->id)->first();

            if (!$teacher) {
                return response()->json(['message' => 'Teacher not found'], 404);
            }

            $notificationsQuery = $teacher->notifications()->orderByDesc('notification_teacher.created_at');

            if ($unreadOnly) {
                $notificationsQuery->wherePivot('status', 'unread');
            }

            $notifications = $notificationsQuery->get()->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'message' => $notification->message,
                    'status' => $notification->pivot->status ?? 'unread',
                ];
            });
        } elseif ($role === 'student') {
            $student = \App\Models\Student::where('user_id', $user->id)->first();

            if (!$student) {
                return response()->json(['message' => 'Student not found'], 404);
            }

            $notificationsQuery = $student->notifications()->orderByDesc('notification_student.created_at');

            if ($unreadOnly) {
                $notificationsQuery->wherePivot('status', 'unread');
            }

            $notifications = $notificationsQuery->get()->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'message' => $notification->message,
                    'status' => $notification->pivot->status ?? 'unread',
                ];
            });
        } else {
            // Fallback for roles like admin (without pivot tables)
            $notifications = Notification::where('is_published', true)
                ->where(function ($query) use ($role) {
                    $query->where('type', $role)->orWhere('type', 'common');
                })
                ->latest()
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'message' => $notification->message,
                        'status' => 'unread',
                    ];
                });

            if ($unreadOnly) {
                // All are unread for admin fallback
                $notifications = $notifications->filter(fn($n) => $n['status'] === 'unread')->values();
            }
        }

        return response()->json($notifications);
    }
    public function getUnreadNotifications(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'teacher') {
            return response()->json([], 403); // Only for teachers for now
        }

        $teacher = \App\Models\Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return response()->json(['message' => 'Teacher not found'], 404);
        }

        // Fetch only unread notifications from the pivot table
        $unreadNotifications = $teacher->notifications()
            ->wherePivot('status', 'unread')
            ->orderByDesc('notification_teacher.created_at')
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'message' => $notification->message,
                    'status' => $notification->pivot->status,
                ];
            });

        return response()->json($unreadNotifications);
    }

    //for web push notifications to work the frontend subscribes to push services and it returns
    //push subscription object and it must be stored in db
    public function saveSubscription(Request $request)
    {
        $data = $request->all();
        Log::info('Push subscription received', $data);
        // Store $data in a subscriptions table, associated with the user
        return response()->json(['success' => true]);
    }


    //Get notifications for the logged-in student using custom table structure
    public function studentCustomNotifications(Request $request)
    {
        $user = $request->user();
        $student = \App\Models\Student::where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }
        // Fetch all notifications for the student, including read/unread status from the pivot table
        $notifications = $student->notifications()
            ->orderByDesc('notification_student.created_at')
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'message' => $notification->message,
                    'status' => $notification->pivot->status ?? 'unread', //initially/if nothing status set to unread
                ];
            });

        return response()->json($notifications);
    }
    // Get only unread notifications for the logged-in student
    public function studentUnreadNotifications(Request $request)
    {
        $user = $request->user();
        $student = \App\Models\Student::where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        // Fetch only unread notifications from the pivot table
        $unreadNotifications = $student->notifications()
            ->wherePivot('status', 'unread')
            ->orderByDesc('notification_student.created_at')
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'message' => $notification->message,
                    'status' => $notification->pivot->status,
                    'created_at' => $notification->pivot->created_at,
                ];
            });

        // If no unread notifications, return a message for clarity
        if ($unreadNotifications->isEmpty()) {
            return response()->json([]); // or you can return a message array
        }

        return response()->json($unreadNotifications);
    }
}

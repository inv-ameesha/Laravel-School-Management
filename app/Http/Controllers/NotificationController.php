<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Notifications\PushTeacherNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type');//gets the type - student,teacher,common
        //filter the notification on the basis of latest notification first
        $notifications = Notification::where('type', $type)->latest()->get();
        return response()->json($notifications);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:student,teacher,common',//select which type
            'message' => 'required|string',
        ]);

        $notification = Notification::create($validated);

        if (in_array($validated['type'], ['teacher', 'common'])) {//if common / teacher type
            $teacherIds = Teacher::pluck('id');//get all teachers id

            $syncData = [];
            foreach ($teacherIds as $id) {
                //we will create status unread for all teachers in pivot(notification_teacher) table 
                $syncData[$id] = ['status' => 'unread'];
            }
            //attch the notifications to pivot table
            //attach is basically for many-to-many relations 
            $notification->teachers()->attach($syncData);

            // Send real web push notifications:
            $teachers = Teacher::whereIn('id', $teacherIds)->get();//loads teacher's data
            foreach ($teachers as $teacher) {
                if ($teacher->user) { // assuming teacher has a related User model
                    $teacher->user->notify(new PushTeacherNotification($validated['message']));
                }
            }
        }

        // Attach notifications to students if type is student or common
        if (in_array($validated['type'], ['student', 'common'])) {
            $studentIds = Student::pluck('id');
            $syncData = [];
            foreach ($studentIds as $id) {
                $syncData[$id] = ['status' => 'unread'];
            }
            $notification->students()->attach($syncData);

            // Send real web push notifications to students with subscriptions
            $students = Student::whereIn('id', $studentIds)->get();
            foreach ($students as $student) {
                if ($student->user) { // assuming student has a related User model
                    $student->user->notify(new \App\Notifications\PushStudentNotification($validated['message']));
                }
            }
        }

        return response()->json([
            'message' => 'Notification created and pushed successfully',
            'notification' => $notification,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([//validation
            'message' => 'required|string',
        ]);

        $notification = Notification::findOrFail($id);//find notification id
        $notification->update([
            'message' => $validated['message'],//updation done
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
        $notification->is_published = !$notification->is_published;//toggle the value
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

        $notifications = Notification::where('is_published', true)//gets the published notifications
            ->where(function ($query) use ($role) {
                $query->where('type', $role)//get notifications for that role
                    ->orWhere('type', 'common');//get notifications common
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
                    'status' => $notification->pivot->status,//fetches teacher information from table
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

        if ($role === 'teacher') {//checks for the logged_in user in the db
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
        // } else {
        //     // Fallback for roles like admin (without pivot tables)
        //     $notifications = Notification::where('is_published', true)
        //         ->where(function ($query) use ($role) {
        //             $query->where('type', $role)->orWhere('type', 'common');
        //         })
        //         ->latest()
        //         ->get()
        //         ->map(function ($notification) {
        //             return [
        //                 'id' => $notification->id,
        //                 'message' => $notification->message,
        //                 'status' => 'unread',
        //             ];
        //         });

        //     if ($unreadOnly) {
        //         // All are unread for admin fallback
        //         $notifications = $notifications->filter(fn($n) => $n['status'] === 'unread')->values();
        //     }
        // }
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
                    'status' => $notification->pivot->status ?? 'unread',//initially/if nothing status set to unread
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

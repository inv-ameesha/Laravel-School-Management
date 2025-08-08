<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Http\Request;
use App\Notifications\PushTeacherNotification;

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::get('/test-push', function () {
    $user = User::first();  // Or get the logged-in user for testing
    if (!$user) {
        return response()->json(['error' => 'No user found']);
    }
    $user->notify(new PushTeacherNotification("This is a test push notification!"));
    return response()->json(['message' => 'Push sent']);
});
Route::middleware(['auth:api'])->group(function () { //middleware ensures that only authenticated users could access that routes
    //api : the guard specified
    Route::middleware(['auth:api'])->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);

        // Admin only routes
        Route::middleware(['role:admin'])->group(function () {
            Route::apiResource('teachers', TeacherController::class);
            Route::apiResource('notifications', NotificationController::class)->only([
                'index',
                'store',
                'destroy',
                'update'
            ]);
        });

        // Admin & Teacher can manage students
        Route::middleware(['role:admin,teacher'])->group(function () {
            Route::apiResource('students', StudentController::class);
        });

        // Notification publishing
        Route::put('/notifications/{id}/publish', [NotificationController::class, 'publish']);
        //Route::get('/my-notifications', [NotificationController::class, 'userNotifications']);
        Route::get('/my-notifications', [NotificationController::class, 'getMyNotificationsWithStatus']);
        Route::get('/user-notifications', [NotificationController::class, 'userNotifications']);
        Route::put('/mark-notification-read', [NotificationController::class, 'markNotificationRead']);
        Route::get('/unread-notifications', [NotificationController::class, 'getUnreadNotifications']);
        Route::post('/save-subscription', [NotificationController::class, 'saveSubscription']);
        //Route::get('/my-notifications', [NotificationController::class, 'myNotifications']);
        Route::post('/mark-as-read/{id}', [NotificationController::class, 'markAsRead']);
        Route::get('/student-custom-notifications', [NotificationController::class, 'studentCustomNotifications'])->middleware('auth:api');
        Route::get('/student-unread-notifications', [NotificationController::class, 'studentUnreadNotifications'])->middleware('auth:api');
    });
});

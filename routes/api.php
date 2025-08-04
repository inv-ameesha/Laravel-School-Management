<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware(['auth:api'])->group(function () { //middleware ensures that only authenticated users could access that routes
    //api : the guard specified
    Route::post('/logout', [AuthController::class, 'logout']);
    //includes every operations for teachers like 
    //index-list , store-create , destroy-delete , show - list that specified teacher , update-edit
    Route::middleware(['auth:api', 'role:admin'])->group(function () {
        
        Route::apiResource('teachers', TeacherController::class);
    });
    Route::middleware(['auth:api', 'role:admin,teacher'])->group(function () {
        Route::apiResource('students', StudentController::class);
    });
});

<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Teacher;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index()
    {
        //echo "reached";
        $teachers = Teacher::where('status', 'Active')->get();
        return response()->json($teachers);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name'            => 'required|string|max:255',
            'last_name'             => 'required|string|max:255',
            'email'                 => 'required|email|unique:teachers|unique:users',
            'phone_number'          => 'required|string|max:20',
            'subject_specialization' => 'required|string|max:255',
            'employee_id'           => 'required|string|unique:teachers',
            'date_of_joining'       => 'required|date',
            'status'                => 'required|in:Active,Inactive',
            'password'              => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Registration failed!',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'name'      => $request->first_name . ' ' . $request->last_name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => 'teacher',
            'is_admin'  => false,
        ]);

        $teacher = Teacher::create([
            'first_name'            => $request->first_name,
            'last_name'             => $request->last_name,
            'email'                 => $request->email,
            'phone_number'          => $request->phone_number,
            'subject_specialization' => $request->subject_specialization,
            'employee_id'           => $request->employee_id,
            'date_of_joining'       => $request->date_of_joining,
            'status'                => $request->status,
        ]);

        return response()->json([
            'message' => 'Teacher registered successfully',
            'user' => $user,
            'teacher' => $teacher
        ], 201);
    }

    public function show($id)
    {
        $teacher = Teacher::find($id); //from the Teacher model find the corresponding teacher with primarykey id=$id
        if (!$teacher) {
            return response()->json(['message' => 'Teacher not found'], 404);
        }
        return response()->json([
            'message' => "Teacher details got",
            'data' => $teacher
        ]);
    }
    public function update(Request $request, $id)
    {
        $teacher = Teacher::find($id);
        if (!$teacher) {
            return response()->json(['message' => 'Teacher not found'], 404);
        }
        $validated = $request->validate([
            'first_name' => 'sometimes|required',
            'last_name' => 'sometimes|required',
            'email' => 'sometimes|required|email|unique:teachers,email,' . $teacher->id,
            'phone_number' => 'sometimes|required',
            'subject_specialization' => 'sometimes|required',
            'employee_id' => 'sometimes|required|unique:teachers,employee_id,' . $teacher->id,
            'date_of_joining' => 'sometimes|required|date',
            'status' => 'sometimes|required|in:Active,Inactive',
        ]);
        $teacher->update($validated);
        return response()->json([
            'message' => 'Teacher updated successfully',
            'data' => $teacher
        ]);
    }
    public function destroy($id)
    {
        $teacher = Teacher::find($id);
        if (!$teacher) {
            return response()->json(['message' => 'Teacher not found'], 404);
        }

        $teacher->update(['status' => 'Inactive']); // Set status to Inactive
        $teacher->delete(); // Soft delete

        return response()->json(['message' => 'Teacher deleted (soft deleted & marked Inactive)']);
    }
}

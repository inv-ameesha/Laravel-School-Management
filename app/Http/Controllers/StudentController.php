<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::where('status', 'Active')->get(); 
        return response()->json($students);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'email'          => 'required|email|unique:students|unique:users',
            'phone'          => 'required|string|max:20',
            'roll_number'    => 'required|string|unique:students',
            'class'          => 'required|string|max:100',
            'dob'            => 'required|date',
            'admission_date' => 'required|date',
            'status'         => 'required|in:Active,Inactive',
            'password'       => 'required|string|min:6',
            'teacher_id'     => 'nullable|exists:teachers,id',
        ]);
        $user = User::create([
            'name'      => $validated['first_name'] . ' ' . $validated['last_name'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
            'role'      => 'student',
            'is_admin'  => false,
        ]);
        $student = Student::create([
            'first_name'     => $validated['first_name'],
            'last_name'      => $validated['last_name'],
            'email'          => $validated['email'],
            'phone'          => $validated['phone'],
            'roll_number'    => $validated['roll_number'],
            'class'          => $validated['class'],
            'dob'            => $validated['dob'],
            'admission_date' => $validated['admission_date'],
            'status'         => $validated['status'],
            'teacher_id'     => $validated['teacher_id'] ?? null,
        ]);

        return response()->json([
            'message' => 'Student registered successfully',
            'user' => $user,
            'student' => $student
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Student::with('teacher')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'first_name'     => 'sometimes|required|string|max:255',
            'last_name'      => 'sometimes|required|string|max:255',
            'phone'          => 'sometimes|required|string|max:20',
            'roll_number'    => "sometimes|required|string|unique:students,roll_number,$id",
            'class'          => 'sometimes|required|string|max:50',
            'dob'            => 'sometimes|required|date',
            'admission_date' => 'sometimes|required|date',
            'status'         => 'sometimes|required|in:Active,Inactive',
            'teacher_id'     => 'sometimes|required|exists:teachers,id',
        ]);

        $student->update($validated);
        return response()->json($student);
    }
    public function destroy(string $id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $student->update(['status' => 'Inactive']); // Set status to Inactive
        $student->delete(); // Soft delete

        return response()->json(['message' => 'Student deleted (soft deleted & marked Inactive)']);
    }
}

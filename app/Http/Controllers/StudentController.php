<?php

namespace App\Http\Controllers;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return Student::with('teacher')->get();
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'email'          => 'required|email|unique:students',
            'phone'          => 'required|string|max:20',
            'roll_number'    => 'required|string|unique:students',
            'class'          => 'required|string|max:50',
            'dob'            => 'required|date',
            'admission_date' => 'required|date',
            'status'         => 'required|in:Active,Inactive',
            'teacher_id'     => 'required|exists:teachers,id',
        ]);

        $student = Student::create($validated);
        return response()->json($student, 201);
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
        Student::destroy($id);
        return response()->json(['message' => 'Student deleted']);
    }
}

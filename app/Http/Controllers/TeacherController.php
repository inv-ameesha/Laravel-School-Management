<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index(){
        $teachers = Teacher::all();
        return response()->json($teachers); 
    }
    public function store(Request $request){
        $validated = $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:teachers,email',
            'phone_number' => 'required',
            'subject_specialization' => 'required',
            'employee_id' => 'required|unique:teachers,employee_id',
            'date_of_joining' => 'required|date',
            'status' => 'required|in:Active,Inactive',
        ]);
        $teacher = Teacher::create($validated);
        return response()->json([
            'message' => 'Teacher created successfully',
            'data' => $teacher
        ], 201);
    }
    public function show($id){
        $teacher = Teacher::find($id);//from the Teacher model find the corresponding teacher with primarykey id=$id
         if (!$teacher) {
            return response()->json(['message' => 'Teacher not found'], 404);
        }
        return response()->json([
            'message'=>"Teacher details got",
            'data'=> $teacher
        ]);
    }
    public function update(Request $request,$id){
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
    public function destroy($id){
        $teacher = Teacher::find($id);
        if(!$teacher){
            return response()->json(['message' => 'Teacher not found'], 404);
        }
        $teacher->delete();
        return response()->json(['message' => 'Teacher deleted']);
    }
}

@extends ('layouts.app');

@section('content')
    <h2>Add Teacher</h2>
    <form action="{{route('teachers.store')}}" method="POST">
        @csrf 
        <label>First Name:</label><br>
        <input type="text" name="first_name" required><br><br>

        <label>Last Name:</label><br>
        <input type="text" name="last_name" required><br><br>

        <label>Email:</label><br>
        <input type="email" name="email" required><br><br>

        <label>Phone:</label><br>
        <input type="text" name="phone_number" required><br><br>

        <label>Subject Specialization:</label><br>
        <input type="text" name="subject_specialization" required><br><br>

        <label>Employee ID:</label><br>
        <input type="text" name="employee_id" required><br><br>

        <label>Date of Joining:</label><br>
        <input type="date" name="date_of_joining" required><br><br>

        <label>Status:</label><br>
        <select name="status" required>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
        </select><br><br>

        <button type="submit">Add Teacher</button>
    </form>
@endsection
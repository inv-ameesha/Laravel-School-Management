<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
        }

        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            background-color: #f4f4f4;
            padding: 15px 20px;
            border-bottom: 1px solid #ddd;
        }

        .header h4 {
            margin: 0;
            text-align: center;
            flex: 1;
        }

        .header a {
            position: absolute;
            right: 20px;
            text-decoration: none;
            background-color: #e74c3c;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
        }

        .header a:hover {
            background-color: #c0392b;
        }

        .container {
            display: flex;
        }

        .sidebar {
            width: 200px;
            background-color: #2c3e50;
            padding-top: 20px;
            height: 100vh;
        }

        .sidebar ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .sidebar li {
            margin: 10px 0;
        }

        .sidebar a {
            color: white;
            text-decoration: none;
            display: block;
            padding: 10px 15px;
        }

        .sidebar a:hover {
            background-color: #34495e;
        }

        .main-content {
            padding: 20px;
            flex: 1;
        }
    </style>
</head>
<body>

    <div class="header">
        <h4>Welcome, Admin!</h4>
        <a href="{{ url('login') }}">Logout</a>
    </div>

    <div class="container">
        <div class="sidebar">
            <ul>
                <li><a href="students.php">Add Students</a></li>
                <li><a href="#">View Students</a></li>
                <li><a href="{{route('teachers.create')}}">Add Teachers</a></li>
                <li><a href="#">View Teachers</a></li>
            </ul>
        </div>

        <div class="main-content">
            <p>This is your dashboard content.</p>
        </div>
    </div>

</body>
</html>

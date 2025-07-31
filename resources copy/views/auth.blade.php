<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
    <h2>Login</h2>
    @if ($errors->any())<!-- Check whether any errors exist/not -->
        <div style="color: red;">
            <ul>
                <!-- Retrieve all the errors as array -->
                @foreach($errors->all() as $error)
                    <li>{$error}</li><!-- display the error -->
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ url ('login') }}" method="POST">
        @csrf 
            <label>Email:</label><br>
            <input type="email" name="email" value="{{ old('email') }}" required autofocus><br><br>

            <label>Password:</label><br>
            <input type="password" name="password" required><br><br>

            <button type="submit">Login</button>
    </form>
</body>
</html>
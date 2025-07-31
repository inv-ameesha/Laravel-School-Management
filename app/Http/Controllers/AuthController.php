<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'], //email is required and need to be in email format
            'password' => ['required']
        ]);
        if (Auth::attempt($credentials)) { //check whether the user is authenticated using the obtained credentials
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 401);
        }
        $user = Auth::user();

        return response()->json([
            'message' => 'Login successful',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}

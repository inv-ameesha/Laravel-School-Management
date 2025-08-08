<?php

namespace App\Http\Controllers;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'], //email is required and need to be in email format
            'password' => ['required']
        ]);
        $token = Auth::guard('api')->attempt($credentials);
        //Auth : laravel's facade which helps in all authentication related activities like login,logout etc
        //Auth::guard('api') : authentication will be dealt by the api guard
        //attempt($credentials) : authenticate with the obtained credentials , credentials will be an array of useranme and pwd
        if (!$token) { //check whether the user is authenticated using the obtained credentials
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 401);
        }

        $user = Auth::guard('api')->user(); //the currently authenticated user will be returned under that guard
        $teacher = Teacher::where('email', $user->email)->first();
        //response(): function that creates HTTP response
        return response()->json([ //response in json format
            'access_token' => $token, //token obtained above
            'expires_in' => JWTAuth::factory()->getTTL() * 60, //JWTAuth : lARAVEL FACADE,factory() - helps in token creation, handling etc
            //TTL - time to live,getTTL() - returns TTL in min
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_email' => $user->email,
            'user_role' => $user->role,
            'teacher_id' => $teacher?->id
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

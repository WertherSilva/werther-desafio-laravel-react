<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        $token = auth('api')->attempt($credentials);

        if (!$token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response($token, 200)->header('Content-Type', 'text/plain');
    }

    public function logout(Request $request) {
        auth('api')->logout();

        return response()->json([
            'message' => 'Deslogado com sucesso.'
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // 📝 REGISTER
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        // 👑 primeiro user vira admin
        $role = User::count() === 0 ? 'admin' : 'user';

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $role
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'role' => $user->role
        ]);
    }

    // 🔐 LOGIN
public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    // ❌ user não existe
    if (!$user) {
        return response()->json(['error' => 'Credenciais inválidas'], 401);
    }

    // 🚫 user eliminado
    if ($user->deleted_at !== null) {
        return response()->json(['error' => 'Conta desativada'], 403);
    }

    // 🔐 password check
    if (!Hash::check($request->password, $user->password)) {
        return response()->json(['error' => 'Credenciais inválidas'], 401);
    }

    // 🔑 token simples
    $token = base64_encode($user->email . '|' . now());

    return response()->json([
        'token' => $token,
        'user_email' => $user->email,
        'role' => $user->role
    ]);
}
}

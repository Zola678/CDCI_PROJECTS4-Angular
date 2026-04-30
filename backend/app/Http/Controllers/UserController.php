<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    // 📋 listar users ativos
    public function index()
    {
        return User::all();
    }

    // 🗑️ apagar (soft delete)
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json([
            'message' => 'User moved to trash'
        ]);
    }

    // 🧺 ver lixeira
    public function trash()
    {
        return User::onlyTrashed()->get();
    }

    // ♻️ restaurar user
    public function restore($id)
    {
        $user = User::withTrashed()->find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->restore();

        return response()->json([
            'message' => 'User restored'
        ]);
    }

    // 💀 apagar definitivamente
    public function forceDelete($id)
    {
        $user = User::withTrashed()->find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->forceDelete();

        return response()->json([
            'message' => 'User permanently deleted'
        ]);
    }
}

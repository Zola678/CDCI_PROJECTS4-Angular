<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // 📋 listar users ativos com produtos (Admin Only)
    public function index(Request $request)
    {
        $user = $this->getUser($request);

        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return User::with('products')->get();
    }

    // 🗑️ apagar (soft delete)
    public function destroy(Request $request, $id = null)
    {
        $authUser = $this->getUser($request);

        if (!$authUser) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Se ID não for passado, assume que o user quer apagar a própria conta
        $targetId = $id ?? $authUser->id;
        $user = User::find($targetId);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Only admin or the user themselves can delete
        if ($authUser->role !== 'admin' && $authUser->id !== $user->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User moved to trash'
        ]);
    }

    // 🧺 ver lixeira (Admin Only)
    public function trash(Request $request)
    {
        $user = $this->getUser($request);

        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return User::onlyTrashed()->get();
    }

    // ♻️ restaurar user (Admin Only)
    public function restore($id, Request $request)
    {
        $user = $this->getUser($request);

        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $targetUser = User::withTrashed()->find($id);

        if (!$targetUser) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $targetUser->restore();

        return response()->json([
            'message' => 'User restored'
        ]);
    }

    // 💀 apagar definitivamente (Admin Only)
    public function forceDelete($id, Request $request)
    {
        $user = $this->getUser($request);

        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $targetUser = User::withTrashed()->find($id);

        if (!$targetUser) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $targetUser->forceDelete();

        return response()->json([
            'message' => 'User permanently deleted'
        ]);
    }
}

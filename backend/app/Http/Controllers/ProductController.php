<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\User;

class ProductController extends Controller
{
    // 🔐 pegar user via token simples (ROBUSTO)
    private function getUser($request)
    {
        $auth = $request->header('Authorization');

        if (!$auth) {
            return null;
        }

        // 🔥 remove "Bearer " se existir
        $auth = str_replace('Bearer ', '', $auth);

        // 🔥 decode seguro
        $decoded = base64_decode($auth, true);

        if (!$decoded) {
            return null;
        }

        // 🔥 extrai email
        $parts = explode('|', $decoded);
        $email = $parts[0] ?? null;

        if (!$email) {
            return null;
        }

        // 🔥 busca user
        return User::where('email', $email)->first();
    }

    // 📦 LISTAR produtos do user logado
    public function index(Request $request)
    {
        $user = $this->getUser($request);

        if (!$user) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 401);
        }

        return Product::where('user_id', $user->id)->get();
    }

    // ➕ CRIAR produto
    public function store(Request $request)
    {
        $user = $this->getUser($request);

        if (!$user) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 401);
        }

        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'quantity' => 'required|integer',
            'price' => 'required|numeric'
        ]);

        $product = Product::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'description' => $request->description,
            'quantity' => $request->quantity,
            'price' => $request->price,
            'total_price' => $request->quantity * $request->price
        ]);

        return response()->json($product);
    }

    // ❌ APAGAR produto (seguro)
    public function destroy($id, Request $request)
    {
        $user = $this->getUser($request);

        if (!$user) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 401);
        }

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'error' => 'Product not found'
            ], 404);
        }

        // 🔐 só dono pode apagar
        if ($product->user_id !== $user->id) {
            return response()->json([
                'error' => 'Forbidden'
            ], 403);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted'
        ]);
    }
}

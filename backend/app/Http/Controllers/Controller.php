<?php

namespace App\Http\Controllers;

use App\Models\User;

abstract class Controller
{
    // 🔐 pegar user via token simples (ROBUSTO)
    protected function getUser($request)
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
}

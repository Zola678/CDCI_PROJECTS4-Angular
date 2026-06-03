<?php

namespace App\Http\Controllers;

use App\Models\User;

abstract class Controller
{
    // 🔐 pegar user via token simples (ROBUSTO)
    protected function getUser($request)
    {
        // 1. Tentar Header Authorization
        $auth = $request->header('Authorization');

        // 2. Se não houver Header, tentar Cookie (Novo método seguro)
        if (!$auth) {
            $auth = $request->cookie('auth_token');
            \Log::info('Tentando recuperar via Cookie: ' . ($auth ? 'Encontrado' : 'Não encontrado'));
        } else {
            // 🔥 remove "Bearer " se existir no header
            $auth = str_replace('Bearer ', '', $auth);
        }

        if (!$auth) {
            return null;
        }

        // 🔥 decode seguro
        $decoded = base64_decode($auth, true);
        
        if (!$decoded) {
            \Log::error('Falha no decode base64: ' . $auth);
            return null;
        }

        // 🔥 extrai email
        $parts = explode('|', $decoded);
        $email = $parts[0] ?? null;

        if (!$email) {
            return null;
        }

        // 🔥 busca user
        $user = User::where('email', $email)->first();
        \Log::info('Usuário autenticado: ' . ($user ? $user->email : 'Nenhum'));
        
        return $user;
    }
}

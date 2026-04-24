<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 🔓 ROTAS PÚBLICAS (sem login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// 🔐 ROTAS PROTEGIDAS (precisa de token)
Route::middleware('auth:sanctum')->group(function () {

    // 👤 utilizador autenticado
    Route::get('/user', [AuthController::class, 'user']);

    // 🚪 logout (remove token atual)
    Route::post('/logout', [AuthController::class, 'logout']);

});

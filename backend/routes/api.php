<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| PRODUCTS (USER)
|--------------------------------------------------------------------------
*/
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| ADMIN AREA
|--------------------------------------------------------------------------
*/
Route::get('/admin/users', [UserController::class, 'index']);
Route::get('/admin/users/trash', [UserController::class, 'trash']);
Route::post('/admin/users/{id}/restore', [UserController::class, 'restore']);
Route::delete('/admin/users/{id}/force', [UserController::class, 'forceDelete']);

Route::get('/admin/products', [ProductController::class, 'allProducts']);

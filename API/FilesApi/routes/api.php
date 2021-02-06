<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('auth',  [AuthController::class, 'me']);
Route::post('auth/token',  [AuthController::class, 'token']);
Route::post('auth/refresh',  [AuthController::class, 'refresh']);


Route::get('file',  [FileController::class, 'getAll']);
Route::get('file/{id}/file',[FileController::class,'getFile']);
Route::get('file/{id}/preview',[FileController::class,'preview']);
Route::delete('file/{id}',[FileController::class,'delete']);
Route::post('file',  [FileController::class, 'post']);
Route::put('file',  [FileController::class, 'put']);
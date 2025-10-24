<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AlumniRegistrationController;




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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});





Route::post('/mobile/login', 'App\Http\Controllers\AuthController@login');
Route::post('/login', 'App\Http\Controllers\AuthController@login');



Route::post('/notifications/logout', [SportsController::class, 'logout']);

Route::prefix('alumni')->group(function () {
    Route::post('/register', [AlumniRegistrationController::class, 'store']);
    Route::get('/', [AlumniRegistrationController::class, 'index']);
    Route::get('/{id}', [AlumniRegistrationController::class, 'show']);
    Route::put('/{id}', [AlumniRegistrationController::class, 'update']);
    Route::patch('/{id}/status', [AlumniRegistrationController::class, 'updateStatus']);
});
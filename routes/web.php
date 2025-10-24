<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ScheduleController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::view('/{path?}', 'app');

// Route::any('*', function(){
// 	return view('app');
// });


Route::get('/schedule-details-pdf/{id}', [ ScheduleController::class, 'schedDetailsPdf'] );
Route::get('/schedule-pdf/{sy}/{sem}/{category}/{college}/{dept}', [ ScheduleController::class, 'schedPdf'] );
Route::get('/{path?}', function () {
	return view('app');
})
//->where('path','!=', '/schedule-details-pdf');
->where('path', '.*');

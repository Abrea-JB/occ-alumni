<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AlumniRegistrationController;
use App\Http\Controllers\GlobalAluminiController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\AdminDashboardController;



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


//public route
Route::get('/check-email', [AlumniRegistrationController::class, 'checkEmail']);
Route::get('/check-phone', [AlumniRegistrationController::class, 'checkPhone']);
Route::get('/check-student-id', [AlumniRegistrationController::class, 'checkStudentId']);


Route::group([
    'middleware' => 'auth:api'
], function () {
    Route::get('/events/data', [EventController::class, 'getEventData']);
    Route::post('/events', [EventController::class, 'store']);
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{event}', [EventController::class, 'show']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);
    Route::post('/events/{event}/duplicate', [EventController::class, 'duplicate']);
    Route::post('/events/{event}/register', [EventController::class, 'register']);
    
    Route::get('/questions', [QuestionController::class, 'index']);
    Route::post('/questions', [QuestionController::class, 'store']);
    Route::get('/questions/{question}', [QuestionController::class, 'show']);
    Route::put('/questions/{question}', [QuestionController::class, 'update']);
    Route::delete('/questions/{question}', [QuestionController::class, 'destroy']);

    // Quizzes Routes
    Route::get('/quizzes', [QuizController::class, 'index']);
    Route::post('/quizzes', [QuizController::class, 'store']);
    Route::get('/quizzes/{quiz}', [QuizController::class, 'show']);
    Route::put('/quizzes/{quiz}', [QuizController::class, 'update']);
    Route::delete('/quizzes/{quiz}', [QuizController::class, 'destroy']);
    Route::post('/quizzes/{quiz}/duplicate', [QuizController::class, 'duplicate']);
    Route::put('/quizzes/{quiz}/order', [QuizController::class, 'updateOrder']);
    Route::post('quiz-active', [QuizController::class, 'quizActive']);
    Route::get('/answer-quizzes', [QuizController::class, 'answerQuiz']);
    Route::get('/quizzes-result', [QuizController::class, 'quizzesResult']);



    
    Route::post('save-alumni-quiz', [QuizController::class, 'saveAlumniQuiz']);

    Route::prefix('alumni')->group(function () {

        Route::post('/update-stastus', [AlumniRegistrationController::class, 'updateStatus']);
        Route::get('/', [AlumniRegistrationController::class, 'index']);
        Route::get('/{id}', [AlumniRegistrationController::class, 'show']);
        Route::put('/{id}', [AlumniRegistrationController::class, 'update']);
        Route::patch('/{id}/status', [AlumniRegistrationController::class, 'updateStatus']);
    });

    Route::get('/profile', [GlobalAluminiController::class, 'profile']);
});

Route::post('/alumni/register', [AlumniRegistrationController::class, 'store']);
Route::get('/get-courses', [GlobalAluminiController::class, 'courses']);
Route::get('/get-employee-status', [GlobalAluminiController::class, 'employeeStatus']);
Route::get('/admin-dashboard', [AdminDashboardController::class, 'index']);

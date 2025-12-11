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
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DepartmentHeadController;
use App\Http\Controllers\PasswordResetController;



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

Route::prefix('password')->group(function () {
    Route::post('/find-account', [PasswordResetController::class, 'findAccount']);
    Route::post('/send-reset-link', [PasswordResetController::class, 'sendResetLink']);
    Route::post('/reset', [PasswordResetController::class, 'resetPassword']);
    Route::post('/verify-token', [PasswordResetController::class, 'verifyToken']);
});

//public route
Route::get('/check-email', [AlumniRegistrationController::class, 'checkEmail']);
Route::get('/check-phone', [AlumniRegistrationController::class, 'checkPhone']);
Route::get('/check-student-id', [AlumniRegistrationController::class, 'checkStudentId']);


Route::group([
    'middleware' => 'auth:api'
], function () {
    // Event Registration
    Route::post('/events/{event}/register', [EventController::class, 'register']);
    Route::post('/events/{event}/cancel-registration', [EventController::class, 'cancelRegistration']);
    Route::get('/events/{event}/registrations', [EventController::class, 'registrations']);

    Route::get('/events/data', [EventController::class, 'getEventData']);
    Route::post('/events', [EventController::class, 'store']);
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{event}', [EventController::class, 'show']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);
    
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

    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/count', [NotificationController::class, 'count']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::post('/{id}/mark-read', [NotificationController::class, 'markAsRead']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
        Route::post('/register-device', [NotificationController::class, 'registerDevice']);
    });

    Route::prefix('department-heads')->group(function () {
        Route::get('/', [DepartmentHeadController::class, 'index']);
        Route::post('/', [DepartmentHeadController::class, 'store']);
        Route::put('/{id}', [DepartmentHeadController::class, 'update']);
        Route::delete('/{id}', [DepartmentHeadController::class, 'destroy']);
    });

    Route::get('/department-head/dashboard', [DepartmentHeadController::class, 'dashboard']);
    Route::get('/department-head/alumni', [DepartmentHeadController::class, 'alumni']);
});



Route::post('/alumni/register', [AlumniRegistrationController::class, 'store']);
Route::get('/get-courses', [GlobalAluminiController::class, 'courses']);
Route::get('/get-employee-status', [GlobalAluminiController::class, 'employeeStatus']);
Route::get('/admin-dashboard', [AdminDashboardController::class, 'index']);

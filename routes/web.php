<?php

use Illuminate\Support\Facades\Route;


use Illuminate\Support\Facades\Auth;

// Login page (root)
Route::get('/', function () {
    return response()->file(public_path('dashboard.html'));
})->name('login');

// Dashboard route, protected by auth middleware
Route::get('/dashboard', function () {
    return Auth::check()
        ? response()->file(public_path('dashboard.html'))
        : redirect('/');
})->middleware('auth.redirect');

// Catch-all route for React Router, but exclude /api routes and /dashboard
Route::get('/{any}', function () {
    return response()->file(public_path('dashboard.html'));
})->where('any', '^(?!api|dashboard).*$');

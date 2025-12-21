<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LeadsController;
use App\Http\Controllers\Api\AuthController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Leads resource routes
    Route::apiResource('leads', LeadsController::class);

    // Customers resource routes
    Route::apiResource('customers', \App\Http\Controllers\Api\CustomersController::class);

    // Oppertunities resource routes
    Route::apiResource('oppertunities', \App\Http\Controllers\Api\OppertunitiesController::class);
});

        
    
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LeadsController;
use App\Http\Controllers\Api\AuthController;

use App\Http\Controllers\ServicePersonController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
     
// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Leads resource routes
    Route::get('leads/graph', [LeadsController::class, 'graph']);
    Route::apiResource('leads', LeadsController::class);

    // Customers resource routes
    Route::apiResource('customers', \App\Http\Controllers\Api\CustomersController::class);

    // Oppertunities resource routes
    Route::apiResource('oppertunities', \App\Http\Controllers\Api\OppertunitiesController::class);

    // Deals resource routes
    Route::apiResource('deals', \App\Http\Controllers\Api\DealsController::class);

    // Services resource routes
    Route::apiResource('services', \App\Http\Controllers\Api\ServicesController::class);
    
   // Activities resource routes
       Route::apiResource('activities', App\Http\Controllers\Api\ActivitiesController::class);

   // TaskFollowups resource routes
       Route::apiResource('task-followups', App\Http\Controllers\Api\TaskFollowupsController::class);

   // Employees resource routes
       Route::apiResource('employees', App\Http\Controllers\Api\EmployeesController::class);
   // Employee login logs
       Route::get('employees/{employee}/login-logs', [\App\Http\Controllers\Api\EmployeeLoginHistoryController::class, 'index']);
    // ServicePeople resource routes
    Route::apiResource('service-people', ServicePersonController::class);

    // Interactions routes
    Route::get('interactions', [\App\Http\Controllers\InteractionController::class, 'index']);
    Route::post('interactions', [\App\Http\Controllers\InteractionController::class, 'store']);

    // Lead service people route
    Route::get('lead-service-people', [LeadsController::class, 'getLeadServicePeople']);
});


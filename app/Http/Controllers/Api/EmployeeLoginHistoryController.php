<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EmployeeLoginHistory;

class EmployeeLoginHistoryController extends Controller
{
    public function index($employeeId)
    {
        $history = EmployeeLoginHistory::where('employee_id', $employeeId)
            ->orderBy('login_at', 'desc')
            ->get();
        return response()->json($history);
    }
}

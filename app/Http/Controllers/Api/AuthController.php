<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Employee;
use App\Models\EmployeeLoginHistory;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user || !\Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('crm-token')->plainTextToken;

        // Log login if user is an employee
        $employee = Employee::where('email', $user->email)->first();
        if ($employee) {
            EmployeeLoginHistory::create([
                'employee_id' => $employee->id,
                'login_at' => now(),
            ]);
        }

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}

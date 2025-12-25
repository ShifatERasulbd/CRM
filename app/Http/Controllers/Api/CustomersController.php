<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use Illuminate\Support\Facades\Log;

class CustomersController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            if ($user && $user->email === 'test@example.com') {
                $customers = \App\Models\Lead::with('assignedTo', 'createdBy')
                    ->where('status', 'customer')
                    ->latest()
                    ->get();
            } else {
                $customers = \App\Models\Lead::with('assignedTo', 'createdBy')
                    ->where('status', 'customer')
                    ->where('assigned_to', $user->id)
                    ->latest()
                    ->get();
            }
            return response()->json($customers);
        } catch (\Exception $e) {
            Log::error('Error fetching customers: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching customers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255|unique:leads,email',
                'phone' => 'nullable|string|max:255',
                'company' => 'nullable|string|max:255',
                'status' => 'nullable|string|max:255',
                'source' => 'nullable|string|max:255',
                'assigned_to' => 'nullable|exists:users,id',
                'created_by' => 'required|integer|exists:users,id',
                'notes' => 'nullable|string',
            ]);
            $validated['status'] = 'customer';
            $customer = \App\Models\Lead::create($validated);
            return response()->json([
                'message' => 'Customer created successfully',
                'data' => $customer
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating customer: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating customer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $customer = \App\Models\Lead::with('assignedTo', 'createdBy')
                ->where('status', 'customer')
                ->findOrFail($id);
            return response()->json($customer);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Customer not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching customer: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching customer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $customer = \App\Models\Lead::where('status', 'customer')->findOrFail($id);
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255|unique:leads,email,' . $id,
                'phone' => 'nullable|string|max:255',
                'company' => 'nullable|string|max:255',
                'status' => 'nullable|string|max:255',
                'source' => 'nullable|string|max:255',
                'assigned_to' => 'nullable|exists:users,id',
                'notes' => 'nullable|string',
            ]);
            $customer->update($validated);
            return response()->json([
                'message' => 'Customer updated successfully',
                'data' => $customer
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Customer not found'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating customer: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating customer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $customer = \App\Models\Lead::where('status', 'customer')->findOrFail($id);
            $customer->delete();
            return response()->json([
                'message' => 'Customer deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Customer not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting customer: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting customer',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Deal;
use Illuminate\Support\Facades\Log;

class DealsController extends Controller
{
    public function index()
    {
        try {
            $deals = Deal::with(['lead', 'customer', 'assignedTo', 'createdBy'])->latest()->get();
            return response()->json($deals);
        } catch (\Exception $e) {
            Log::error('Error fetching deals: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching deals',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'lead_id' => 'nullable|exists:leads,id',
                'customer_id' => 'nullable|exists:customers,id',
                'assigned_to' => 'required|exists:users,id',
                'created_by' => 'required|exists:users,id',
                'title' => 'required|string|max:255',
                'deal_value' => 'required|numeric|min:0',
                'stage' => 'required|string|max:255',
                'probability' => 'required|integer|min:0|max:100',
                'expected_close_date' => 'nullable|date',
                'description' => 'nullable|string',
                'is_won' => 'boolean',
                'is_lost' => 'boolean',
                'closed_at' => 'nullable|date',
            ]);
            $deal = Deal::create($validated);
            return response()->json([
                'message' => 'Deal created successfully',
                'data' => $deal
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating deal: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating deal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $deal = Deal::with(['lead', 'customer', 'assignedTo', 'createdBy'])->findOrFail($id);
            return response()->json($deal);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Deal not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching deal: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching deal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $deal = Deal::findOrFail($id);
            $validated = $request->validate([
                'lead_id' => 'nullable|exists:leads,id',
                'customer_id' => 'nullable|exists:customers,id',
                'assigned_to' => 'required|exists:users,id',
                'created_by' => 'required|exists:users,id',
                'title' => 'required|string|max:255',
                'deal_value' => 'required|numeric|min:0',
                'stage' => 'required|string|max:255',
                'probability' => 'required|integer|min:0|max:100',
                'expected_close_date' => 'nullable|date',
                'description' => 'nullable|string',
                'is_won' => 'boolean',
                'is_lost' => 'boolean',
                'closed_at' => 'nullable|date',
            ]);
            $deal->update($validated);
            return response()->json([
                'message' => 'Deal updated successfully',
                'data' => $deal
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Deal not found'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating deal: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating deal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $deal = Deal::findOrFail($id);
            $deal->delete();
            return response()->json([
                'message' => 'Deal deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Deal not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting deal: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting deal',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Oppertunity;
use Illuminate\Support\Facades\Log;
use App\Models\Lead;
class OppertunitiesController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            if ($user && $user->email === 'test@example.com') {
                $oppertunities = Lead::with('assignedTo', 'createdBy')
                    ->where('status', 'qualified')
                    ->latest()
                    ->get();
            } else {
                $oppertunities = Lead::with('assignedTo', 'createdBy')
                    ->where('status', 'qualified')
                    ->where('assigned_to', $user->id)
                    ->latest()
                    ->get();
            }
            return response()->json($oppertunities);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching oppertunities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'value' => 'nullable|numeric',
                'stage' => 'nullable|string|max:255',
                'status' => 'nullable|string|max:255',
                'source' => 'nullable|string|max:255',
                'assigned_to' => 'nullable|exists:users,id',
                'created_by' => 'required|integer|exists:users,id',
                'notes' => 'nullable|string',
            ]);
            $oppertunity = Oppertunity::create($validated);
            return response()->json([
                'message' => 'Oppertunity created successfully',
                'data' => $oppertunity
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating oppertunity: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating oppertunity',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $oppertunity = Oppertunity::with('assignedTo', 'createdBy')->findOrFail($id);
            return response()->json($oppertunity);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Oppertunity not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching oppertunity: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching oppertunity',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $oppertunity = Oppertunity::findOrFail($id);
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'value' => 'nullable|numeric',
                'stage' => 'nullable|string|max:255',
                'status' => 'nullable|string|max:255',
                'source' => 'nullable|string|max:255',
                'assigned_to' => 'nullable|exists:users,id',
                'notes' => 'nullable|string',
            ]);
            $oppertunity->update($validated);
            return response()->json([
                'message' => 'Oppertunity updated successfully',
                'data' => $oppertunity
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Oppertunity not found'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating oppertunity: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating oppertunity',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $oppertunity = Oppertunity::findOrFail($id);
            $oppertunity->delete();
            return response()->json([
                'message' => 'Oppertunity deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Oppertunity not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting oppertunity: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting oppertunity',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

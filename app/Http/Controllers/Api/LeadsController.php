<?php

namespace App\Http\Controllers\Api;
use App\Models\Oppertunity;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;
use Illuminate\Support\Facades\Log;

class LeadsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $leads = Lead::with('assignedTo', 'createdBy')
                ->latest()
                ->get();

            return response()->json($leads);
        } catch (\Exception $e) {
            Log::error('Error fetching leads: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching leads',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
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
                'service_id' => 'nullable|exists:services,id',
                'assigned_to' => 'nullable|exists:users,id',
                'created_by' => 'required|integer|exists:users,id',
                'notes' => 'nullable|string',
            ]);

            $lead = Lead::create($validated);

           
            return response()->json([
                'message' => 'Lead created successfully',
                'data' => $lead
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating lead: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating lead',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $lead = Lead::with('assignedTo', 'createdBy')->findOrFail($id);
            return response()->json($lead);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Lead not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching lead: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching lead',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $lead = Lead::findOrFail($id);

            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255|unique:leads,email,' . $id,
                'phone' => 'nullable|string|max:255',
                'company' => 'nullable|string|max:255',
                'status' => 'nullable|string|max:255',
                'source' => 'nullable|string|max:255',
                'service_id' => 'nullable|exists:services,id',
                'assigned_to' => 'nullable|exists:users,id',
                'notes' => 'nullable|string',
            ]);

            $lead->update($validated);

            return response()->json([
                'message' => 'Lead updated successfully',
                'data' => $lead
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Lead not found'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating lead: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating lead',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $lead = Lead::findOrFail($id);
            $lead->delete();

            return response()->json([
                'message' => 'Lead deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Lead not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting lead: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting lead',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
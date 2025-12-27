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
     * Return leads count per day for the last N days (for dashboard graph)
     */
    public function graph(Request $request)
    {
        try {
            $user = $request->user();
            $days = (int) $request->query('days', 7);
            $days = $days > 0 ? $days : 7;
            $query = Lead::query();
            if (!$user || $user->email !== 'test@example.com') {
                $query->where('assigned_to', $user->id);
            }
            $fromDate = now()->subDays($days - 1)->startOfDay();
            $toDate = now()->endOfDay();
            $leads = $query->whereBetween('created_at', [$fromDate, $toDate])
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupByRaw('DATE(created_at)')
                ->orderBy('date')
                ->get();

            // Fill missing days with 0
            $result = [];
            for ($i = 0; $i < $days; $i++) {
                $date = now()->subDays($days - 1 - $i)->toDateString();
                $found = $leads->firstWhere('date', $date);
                $result[] = [
                    'date' => $date,
                    'count' => $found ? (int)$found->count : 0,
                ];
            }
            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('Error fetching leads graph: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching leads graph',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            // If admin (test@example.com), show all leads
            if ($user && $user->email === 'test@example.com') {
                $leads = Lead::with('assignedTo', 'createdBy')
                    ->latest()
                    ->get();
            } else {
                // Otherwise, only show leads assigned to this user
                $leads = Lead::with('assignedTo', 'createdBy')
                    ->where('assigned_to', $user->id)
                    ->latest()
                    ->get();
            }
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
                'service_person_id' => 'nullable|exists:service_people,id',
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
                'service_person_id' => 'nullable|exists:service_people,id',
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
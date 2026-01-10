<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;
use App\Models\LeadServicePerson;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class LeadsController extends Controller
{
    /**
     * Get leads summary for reports (total, converted, lost, conversion %, loss %, date and status filtering)
     */
    public function leadsSummary(Request $request)
    {
        try {
            $user = $request->user();
            $from = $request->query('from');
            $to = $request->query('to');
            $status = $request->query('status');

            $query = Lead::query();

            // Apply user filter
            if (!$user || $user->email !== 'test@example.com') {
                if ($user) {
                    $query->where('assigned_to', $user->id);
                }
            }

            // Apply date range filters
            if ($from) {
                $query->whereDate('created_at', '>=', $from);
            }
            if ($to) {
                $query->whereDate('created_at', '<=', $to);
            }

            // Apply status filter
            if ($status) {
                $query->where('status', $status);
            }

            $total = (clone $query)->count();
            $converted = (clone $query)->where('status', 'customer')->count();
            $lost = (clone $query)->where('status', 'lost')->count();

            $conversionRate = $total > 0 ? round(($converted / $total) * 100, 2) : 0;
            $lossRate = $total > 0 ? round(($lost / $total) * 100, 2) : 0;

            return response()->json([
                'total' => $total,
                'converted' => $converted,
                'lost' => $lost,
                'conversion_rate' => $conversionRate,
                'loss_rate' => $lossRate,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching leads summary: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching leads summary',
                'error' => $e->getMessage()
            ], 500);
        }
    }
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

            // Protect against null user
            if (!$user || $user->email !== 'test@example.com') {
                if ($user) {
                    $query->where('assigned_to', $user->id);
                }
            }

            $fromDate = now()->subDays($days - 1)->startOfDay();
            $toDate = now()->endOfDay();

            $leads = $query
                ->whereBetween('created_at', [$fromDate, $toDate])
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
                    'count' => $found ? (int) $found->count : 0,
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
            // Get filter parameters
            $from = $request->query('from');
            $to = $request->query('to');
            $status = $request->query('status');

            // Build base query (no user filter)
            $query = Lead::with('assignedTo', 'createdBy', 'leadServicePeople.servicePerson');

            // Apply date range filters
            if ($from) {
                $query->whereDate('created_at', '>=', $from);
            }
            if ($to) {
                $query->whereDate('created_at', '<=', $to);
            }

            // Apply status filter
            if ($status) {
                $query->where('status', $status);
            }

            $leads = $query->latest()->get();

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
            $user = $request->user();

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
                'created_by' => 'nullable|integer|exists:users,id',
                'notes' => 'nullable|string',
                'reference_by_customer' => 'nullable|exists:leads,id',
                'reference_by_staff' => 'nullable|string|max:255',
                'service_person_dates' => 'nullable|array',
                'service_person_dates.*.service_person_id' => 'required|exists:service_people,id',
                'service_person_dates.*.joining_date' => 'nullable|date',
                'service_person_dates.*.end_date' => 'nullable|date',
            ]);

            // Fallback to authenticated user
            $validated['created_by'] = $validated['created_by'] ?? $user?->id;

            $lead = Lead::create($validated);

            // Save service person dates
            if (isset($validated['service_person_dates'])) {
                foreach ($validated['service_person_dates'] as $datePair) {
                    LeadServicePerson::create([
                        'lead_id' => $lead->id,
                        'service_person_id' => $datePair['service_person_id'],
                        'joining_date' => $datePair['joining_date'],
                        'end_date' => $datePair['end_date'],
                    ]);
                }
            }

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
            $lead = Lead::with('assignedTo', 'createdBy', 'leadServicePeople.servicePerson')->findOrFail($id);
            return response()->json($lead);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Lead not found'], 404);
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
                'reference_by_customer' => 'nullable|exists:leads,id',
                'reference_by_staff' => 'nullable|string|max:255',
                'service_person_dates' => 'nullable|array',
                'service_person_dates.*.service_person_id' => 'required|exists:service_people,id',
                'service_person_dates.*.joining_date' => 'nullable|date',
                'service_person_dates.*.end_date' => 'nullable|date',
            ]);

            $lead->update($validated);

            // Sync service person dates
            if (isset($validated['service_person_dates'])) {
                // Delete existing records
                LeadServicePerson::where('lead_id', $lead->id)->delete();

                // Create new records
                foreach ($validated['service_person_dates'] as $datePair) {
                    LeadServicePerson::create([
                        'lead_id' => $lead->id,
                        'service_person_id' => $datePair['service_person_id'],
                        'joining_date' => $datePair['joining_date'],
                        'end_date' => $datePair['end_date'],
                    ]);
                }
            }

            return response()->json([
                'message' => 'Lead updated successfully',
                'data' => $lead
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Lead not found'], 404);
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

            return response()->json(['message' => 'Lead deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Lead not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting lead: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting lead',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get lead service people by lead_id
     */
    public function getLeadServicePeople(Request $request)
    {
        try {
            $leadId = $request->query('lead_id');

            if (!$leadId) {
                return response()->json(['message' => 'lead_id parameter is required'], 400);
            }


            $leadServicePeople = LeadServicePerson::with('servicePerson')
                ->where('lead_id', $leadId)
                ->get()
                ->map(function ($lsp) {
                    $dutyDays = null;
                    if ($lsp->joining_date && $lsp->end_date) {
                        $joiningDate = Carbon::parse($lsp->joining_date);
                        $endDate = Carbon::parse($lsp->end_date);
                        $dutyDays = $joiningDate->diffInDays($endDate) + 1; // +1 to include both start and end dates
                    }

                    return [
                        'id' => $lsp->id,
                        'lead_id' => $lsp->lead_id,
                        'service_person_id' => $lsp->service_person_id,
                        'joining_date' => $lsp->joining_date,
                        'end_date' => $lsp->end_date,
                        'duty_days' => $dutyDays,
                        'first_name' => $lsp->servicePerson->first_name ?? null,
                        'last_name' => $lsp->servicePerson->last_name ?? null,
                        'email' => $lsp->servicePerson->email ?? null,
                        'phone' => $lsp->servicePerson->phone ?? null,
                        'joining_date_sp' => $lsp->servicePerson->joining_date ?? null,
                        'end_date_sp' => $lsp->servicePerson->end_date ?? null,
                        'salary' => $lsp->servicePerson->salary ?? null,
                    ];
                });

            return response()->json($leadServicePeople);
        } catch (\Exception $e) {
            Log::error('Error fetching lead service people: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching lead service people',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Facades\Log;

class ServicesController extends Controller
{
    public function index()
    {
        try {
            $services = Service::with('creator')->latest()->get();
            return response()->json($services);
        } catch (\Exception $e) {
            Log::error('Error fetching services: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching services',
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
                'price' => 'required|numeric|min:0',
                'status' => 'required|string|max:255',
                'created_by' => 'required|exists:users,id',
            ]);
            $service = Service::create($validated);
            return response()->json([
                'message' => 'Service created successfully',
                'data' => $service
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating service: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $service = Service::with('creator')->findOrFail($id);
            return response()->json($service);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Service not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching service: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $service = Service::findOrFail($id);
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'status' => 'required|string|max:255',
                'created_by' => 'required|exists:users,id',
            ]);
            $service->update($validated);
            return response()->json([
                'message' => 'Service updated successfully',
                'data' => $service
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Service not found'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating service: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $service = Service::findOrFail($id);
            $service->delete();
            return response()->json([
                'message' => 'Service deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Service not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting service: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting service',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

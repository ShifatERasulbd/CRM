<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Activity;
use Illuminate\Support\Facades\Validator;

class ActivitiesController extends Controller
{
    public function index()
    {
        return response()->json(Activity::with('user')->latest()->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'nullable|date',
            'type' => 'nullable|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $activity = Activity::create($validator->validated());
        return response()->json($activity, 201);
    }

    public function show($id)
    {
        $activity = Activity::with('user')->find($id);
        if (!$activity) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($activity);
    }

    public function update(Request $request, $id)
    {
        $activity = Activity::find($id);
        if (!$activity) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'nullable|date',
            'type' => 'nullable|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $activity->update($validator->validated());
        return response()->json($activity);
    }

    public function destroy($id)
    {
        $activity = Activity::find($id);
        if (!$activity) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $activity->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}

<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TaskFollowup;
use Illuminate\Support\Facades\Validator;

class TaskFollowupsController extends Controller
{
    public function index()
    {
        return response()->json(TaskFollowup::with('user')->latest()->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'nullable|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $task = TaskFollowup::create($validator->validated());
        return response()->json($task, 201);
    }

    public function show($id)
    {
        $task = TaskFollowup::with('user')->find($id);
        if (!$task) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $task = TaskFollowup::find($id);
        if (!$task) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'nullable|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $task->update($validator->validated());
        return response()->json($task);
    }

    public function destroy($id)
    {
        $task = TaskFollowup::find($id);
        if (!$task) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $task->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}

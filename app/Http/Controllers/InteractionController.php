<?php

namespace App\Http\Controllers;

use App\Models\Interaction;
use Illuminate\Http\Request;

class InteractionController extends Controller
{
    public function index(Request $request)
    {
        $leadId = $request->query('lead_id');
        if (!$leadId) {
            return response()->json(['message' => 'lead_id is required'], 400);
        }
        $interactions = Interaction::where('lead_id', $leadId)->orderBy('created_at', 'desc')->get();
        return response()->json($interactions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'notes' => 'required|string',
        ]);

        $interaction = Interaction::create($validated);

        return response()->json($interaction, 201);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\ServicePerson;
use Illuminate\Http\Request;

class ServicePersonController extends Controller
{
    public function index()
    {
        $servicePeople = ServicePerson::all();
        return response()->json($servicePeople);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:service_people,email',
            'present_address' => 'required|string',
            'permanent_address' => 'required|string',
            'photo' => 'nullable|string',
            'emergency_contact_name' => 'required|string',
            'emergency_contact_phone' => 'required|string',
            'emergency_contact_relation' => 'required|string',
            'salary' => 'nullable|numeric|min:0',
        ]);
        $servicePerson = ServicePerson::create($validated);
        return response()->json($servicePerson, 201);
    }

    public function show($id)
    {
        $servicePerson = ServicePerson::findOrFail($id);
        return response()->json($servicePerson);
    }

    public function update(Request $request, $id)
    {
        $servicePerson = ServicePerson::findOrFail($id);
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|unique:service_people,email,' . $id,
            'present_address' => 'sometimes|required|string',
            'permanent_address' => 'sometimes|required|string',
            'photo' => 'nullable|string',
            'emergency_contact_name' => 'sometimes|required|string',
            'emergency_contact_phone' => 'sometimes|required|string',
            'emergency_contact_relation' => 'sometimes|required|string',
            'salary' => 'nullable|numeric|min:0',
        ]);
        $servicePerson->update($validated);
        return response()->json($servicePerson);
    }

    public function destroy($id)
    {
        $servicePerson = ServicePerson::findOrFail($id);
        $servicePerson->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}

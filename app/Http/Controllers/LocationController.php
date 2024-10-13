<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;
use Inertia\Inertia;
use App\Http\Requests\StoreLocationRequest;
use Illuminate\Support\Facades\Auth;

class LocationController extends Controller
{
    public function create()
    {
        return Inertia::render('Location/Create');
    }
    public function index()
    {
        $user = Auth::user();
        $userStatus = $user->retail->status;

        $locations = Location::where('retail_id', Auth::user()?->retail_id)
            ->withCount('inventories')
            ->get()
            ->map(function ($location) {
                $location->remaining_volume = $location->remaining_volume;
                $location->used_volume = $location->volume - $location->remaining_volume;
                return $location;
            });

        return Inertia::render('Location/Index', [
            'initialLocations' => $locations,
            'userStatus' => $userStatus
        ]);
    }

    public function show(Location $location)
    {
        $location->load('inventories.product', 'inventories.supplier');

        $usedVolume = $location->volume - $location->remaining_volume;

        $remainingVolume = $location->volume - $usedVolume;

        return Inertia::render('Location/DetailLocation', [
            'location' => array_merge($location->toArray(), [
                'used_volume' => $usedVolume,
                'remaining_volume' => $remainingVolume,
            ])
        ]);
    }
    public function store(StoreLocationRequest $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'volume' => 'required|integer|min:0'

        ]);

        Location::create(array_merge($validatedData, ['retail_id' => Auth::user()?->retail_id]));

        return redirect()->route('locations.index')->with('success', 'Location added successfully');
    }



    public function update(Request $request, Location $location)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'volume' => 'required|integer|min:0'
        ]);

        $location->update(array_merge($validatedData, ['retail_id' => Auth::user()?->retail_id]));
    }

    public function destroy(Location $location)
    {
        $location->delete();
    }
}

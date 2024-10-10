<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Retail;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Movements;
use App\Models\Subscription;
use Carbon\Carbon;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Location;

class RetailController extends Controller
{
    //

    public function extendSubscription(Request $request, Retail $retail)
    {
        $newEndDate = Carbon::parse($request->end_date);
        $subscription = Subscription::where('retail_id', $retail->id)->first();
        $subscription->update([
            'end_date' => $newEndDate,
        ]);

        $retail->checkSubscriptionStatus();

        return redirect()->route('dashboard')->with('success', 'Subscription extended successfully');
    }
    public function index()
    {
        $retail = Auth::user()->retail_id;
        $retails = Retail::with('users')->get();
        return Inertia::render('Retails/Index', ['initialRetails' => $retails, 'initialRetail' => $retail]);
    }

    public function destroy(Retail $retail)
    {
        DB::beginTransaction();

        try {
            // Delete stock movements related to products of this retail
            Movements::whereHas('product', function ($query) use ($retail) {
                $query->where('retail_id', $retail->id);
            })->delete();

            // Delete products related to this retail
            Product::where('retail_id', $retail->id)->delete();

            // Delete associated users
            User::where('retail_id', $retail->id)->delete();
            Subscription::where('retail_id', $retail->id)->delete();



            // Delete other related data (add more as needed)
            Brand::where('retail_id', $retail->id)->delete();
            Category::where('retail_id', $retail->id)->delete();
            Location::where('retail_id', $retail->id)->delete();



            // Finally, delete the retail
            $retail->delete();

            DB::commit();

            return redirect()->route('dashboard')->with('success', 'Retail and all associated data deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('dashboard')->with('error', 'An error occurred while deleting the retail: ' . $e->getMessage());
        }
    }

    public function show(Retail $retail)
    {
        return Inertia::render('Retails/EditRetails', ['retail' => $retail]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'retail_name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'kecamatan' => 'required|string|max:255',
                'kelurahan' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'province' => 'required|string|max:255',
                'country' => 'required|string|max:255',
                'postal_code' => 'required|string|max:255',
                'handphone' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string',
                'google_maps_link' => 'nullable|string|max:255',
                'end_subscription' => 'required|date',

            ]);

            // Buat retail baru
            $retail = Retail::create([
                'retail_name' => $validated['retail_name'],
                'address' => $validated['address'],
                'kecamatan' => $validated['kecamatan'],
                'kelurahan' => $validated['kelurahan'],
                'city' => $validated['city'],
                'province' => $validated['province'],
                'country' => $validated['country'],
                'postal_code' => $validated['postal_code'],
                'email' => $validated['email'],
                'handphone' => $validated['handphone'],
                'google_maps_link' => $validated['google_maps_link'],


            ]);

            $user = User::create([
                'name' => $validated['retail_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'user',
                'retail_id' => $retail->id,
            ]);

            $subscription = Subscription::create([
                'retail_id' => $retail->id,
                'start_date' => Carbon::now(),
                'end_date' => Carbon::parse($validated['end_subscription']),
            ]);

            $retail->checkSubscriptionStatus();

            $user->retail()->associate($retail);
            $user->save();



            return redirect()->route('dashboard')->with('success', 'Retail and associated user created successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred: ' . $e->getMessage())->withInput();
        }
    }

    public function create()
    {
        return Inertia::render('Retails/CreateRetail');
    }

    public function update(Request $request, Retail $retail)
    {
        $user = User::where('retail_id', $retail->id)->first();
        if (!$user) {
            return redirect()->back()->with('error', 'Associated user not found for this retail.')->withInput();
        }

        $validated = $request->validate([
            'retail_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'kelurahan' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'handphone' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'google_maps_link' => 'nullable|string|max:255',
            'end_subscription' => 'required|date',
        ]);

        DB::beginTransaction();

        try {
            $retail->update([
                'retail_name' => $validated['retail_name'],
                'address' => $validated['address'],
                'kecamatan' => $validated['kecamatan'],
                'kelurahan' => $validated['kelurahan'],
                'city' => $validated['city'],
                'province' => $validated['province'],
                'country' => $validated['country'],
                'postal_code' => $validated['postal_code'],
                'email' => $validated['email'],
                'handphone' => $validated['handphone'],
                'google_maps_link' => $validated['google_maps_link'],
            ]);

            $userData = [
                'name' => $validated['retail_name'],
                'email' => $validated['email'],
                'role' => 'user',
                'retail_id' => $retail->id,
            ];

            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $user->update($userData);

            $subscription = Subscription::updateOrCreate(
                ['retail_id' => $retail->id],
                ['end_date' => Carbon::parse($validated['end_subscription'])]
            );

            if (method_exists($retail, 'checkSubscriptionStatus')) {
                $retail->checkSubscriptionStatus();
            }

            DB::commit();

            return redirect()->route('retails.index')->with('success', 'Retail updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to update retail account: ' . $e->getMessage())->withInput();
        }
    }
}

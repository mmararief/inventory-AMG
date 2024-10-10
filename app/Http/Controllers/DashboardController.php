<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Inventory;
use Illuminate\Support\Facades\Auth;
use App\Models\Movements;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Retail;

class DashboardController extends Controller
{

    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            $totalRetail = Retail::count();
            $retailAccounts = Retail::with('subscription')->get();
            $totalCities = Retail::distinct()->count('city');
            $activeRetail = Retail::where('status', 'active')->count();
            $inactiveRetail = Retail::where('status', 'inactive')->count();


            return Inertia::render('DashboardAdmin', [
                'totalRetail' => $totalRetail,
                'initialRetailAccounts' => $retailAccounts,
                'totalCities' => $totalCities,
                'activeRetail' => $activeRetail,
                'inactiveRetail' => $inactiveRetail
            ]);
        }


        $userStatus = $user->retail->status;

        $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();

        $stockData = Movements::where('retail_id', Auth::user()?->retail_id)
            ->where('created_at', '>=', $sixMonthsAgo)
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('SUM(CASE WHEN type = "in" THEN quantity ELSE 0 END) as stockIn'),
                DB::raw('SUM(CASE WHEN type = "out" THEN quantity ELSE 0 END) as stockOut')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::createFromFormat('Y-m', $item->month)->format('F'),
                    'stockIn' => (int)$item->stockIn,
                    'stockOut' => (int)$item->stockOut,
                ];
            })
            ->values()
            ->toArray();

        // Ensure we have data for all 6 months
        $allMonths = collect(range(0, 5))->map(function ($i) {
            return [
                'month' => Carbon::now()->subMonths($i)->format('F'),
                'stockIn' => 0,
                'stockOut' => 0,
            ];
        })->reverse()->keyBy('month');

        $stockData = $allMonths->merge(collect($stockData)->keyBy('month'))->values()->toArray();


        $retailId = Auth::user()?->retail_id;
        $totalInventory = Inventory::where('retail_id', $retailId)->count();
        $lowInventory = Inventory::where('quantity', '<', 5)
            ->where('quantity', '>', 0)
            ->where('retail_id', $retailId)
            ->count();
        $outOfStock = Inventory::where('quantity', 0)
            ->where('retail_id', $retailId)
            ->count();
        $recentMovements = Movements::with('product', 'fromLocation', 'toLocation')
            ->where('retail_id', $retailId)
            ->latest()->take(5)->get();


        $recentProducts = Product::with('category', 'brand')
            ->where('retail_id', $retailId)
            ->latest()->take(5)->get();
        return Inertia::render('Dashboard', [
            'totalInventory' => $totalInventory,
            'lowInventory' => $lowInventory,
            'outOfStock' => $outOfStock,
            'userStatus' => $userStatus,
            'recentMovements' => $recentMovements,
            'recentProducts' => $recentProducts,
            'stockData' => $stockData
        ]);
    }
}

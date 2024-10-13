<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Movements;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {

        $user = Auth::user();
        $userStatus = $user->retail->status;

        $query = Movements::where('retail_id', Auth::user()?->retail_id)
            ->with('product', 'fromLocation', 'toLocation');

        // Date range filtering
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        $movements = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('StockMovements/Index', [
            'initialStockMovements' => $movements,
            'filters' => $request->only(['start_date', 'end_date', 'type']),
            'userStatus' => $userStatus
        ]);
    }
}

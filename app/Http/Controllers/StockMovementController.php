<?php

namespace App\Http\Controllers;

use App\Exports\StockMovementsExport;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;
use App\Models\Movements;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use Barryvdh\DomPDF\Facade\Pdf;

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

    public function download(Request $request)
    {

        $type = $request->input('type');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Query your stock movements based on the filters
        $stockMovements = Movements::query()
            ->when($type !== 'all', function ($query, $type) {
                return $query->where('type', $type);
            })
            ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                return $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->where('retail_id', Auth::user()->retail_id)
            ->get();

        return Excel::download(new StockMovementsExport($stockMovements), 'stock_movements_' . $startDate . '_' . $endDate . '.xlsx');
    }

    public function printPdf(Request $request)
    {
        $query = Movements::with(['product', 'fromLocation', 'toLocation'])
            ->orderBy('created_at', 'desc')
            ->where('retail_id', Auth::user()->retail_id);

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        $stockMovements = $query->get();

        $pdf = PDF::loadView('pdf.stock-movements', ['stockMovements' => $stockMovements, 'startDate' => $request->start_date, 'endDate' => $request->end_date]);

        return $pdf->stream('stock-movements-' . $request->start_date . '-' . $request->end_date . '.pdf');
    }
}

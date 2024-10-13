<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Supplier;
use Illuminate\Support\Facades\Auth;

class SupplierController extends Controller
{

    public function create()
    {
        return Inertia::render('Supplier/create');
    }
    public function index()
    {
        $user = Auth::user();
        $userStatus = $user->retail->status;
        $suppliers = Supplier::where('retail_id', Auth::user()?->retail_id)->get();
        return Inertia::render('Supplier/Index', compact('suppliers', 'userStatus'));
    }
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'contact_info' => 'required|string|max:255',
        ]);
        $supplier = Supplier::create(array_merge($validatedData, ['retail_id' => Auth::user()?->retail_id]));
        return redirect()->route('supplier.index')->with('success', 'Supplier created successfully');
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'contact_info' => 'required|string|max:255',
        ]);

        $supplier->update(array_merge($validatedData, ['retail_id' => Auth::user()?->retail_id]));
        return redirect()->route('supplier.index')->with('success', 'Supplier updated successfully');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return redirect()->route('supplier.index')->with('success', 'Supplier deleted successfully');
    }
}

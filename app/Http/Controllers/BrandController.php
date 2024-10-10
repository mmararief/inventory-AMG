<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Brand;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

class BrandController extends Controller
{

    public function index()
    {
        $retail_id = Auth::user()->retail_id;
        $userStatus = Auth::user()->retail->status;

        $brands = Brand::where('retail_id', $retail_id)->latest()->get();

        return Inertia::render('Brands/Index', [
            'initialBrands' => $brands,
            'userStatus' => $userStatus
        ]);
    }

    public function create()
    {
        return Inertia::render('Brands/Index');
    }

    public function store(Request $request)
    {
        $retail_id = Auth::user()->retail_id;

        Brand::create([
            'name' => $request->name,
            'description' => $request->description,
            'retail_id' => $retail_id,
        ]);

        return redirect()->route('brand.index');
    }


    public function destroy(Brand $brand)
    {
        $brand->delete();
    }


    public function update(Request $request, Brand $brand)
    {
        $retail_id = Auth::user()->retail_id;

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',

        ]);

        $brand->update(array_merge($request->all(), ['retail_id' => $retail_id]));
        return redirect()->route('brand.index');
    }
}

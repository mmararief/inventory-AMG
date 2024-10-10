<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Type;
use Illuminate\Contracts\Support\ValidatedData;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    //
    public function index(Request $request)
    {
        $userStatus = Auth::user()->status;
        $query = Product::query()
            ->with(['category', 'brand', 'type'])
            ->where('retail_id', Auth::user()?->retail_id);


        // Apply category filter
        if ($request->has('category') && $request->category !== 'all') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('category_id', $request->category);
            });
        }

        // Apply filters
        if ($request->has('search') && $request->search !== '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }





        // Apply pagination
        $products = $query->paginate(10)->appends($request->query());

        return Inertia::render('Products/Index', [
            'initialProducts' => $products,
            'initialCategories' => Category::where('retail_id', Auth::user()?->retail_id)->get(),
            'initialBrands' => Brand::where('retail_id', Auth::user()?->retail_id)->get(),
            'initialTypes' => Type::where('retail_id', Auth::user()?->retail_id)->get(),
            'filters' => $request->only(['category', 'search']),
            'userStatus' => $userStatus
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'product_code' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'type_id' => 'required|exists:types,id',
        ]);





        $product = Product::create(array_merge($validatedData, ['retail_id' => Auth::user()?->retail_id]));
        // $product->brand()->associate($validatedData['brand_id']);
        // $product->category()->associate($validatedData['category_id']);
        $product->save();



        return redirect()->route('product.index');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('product.index');
    }

    public function update(Request $request, Product $product)
    {
        $validatedData = $request->validate([
            'product_code' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'type_id' => 'required|exists:types,id',
        ]);

        $product->update($validatedData);



        return redirect()->route('product.index')->with('success', 'Product updated successfully');
    }

    public function generateQr($id)
    {
        $product = Product::with('category', 'location')->find($id);
        return Inertia::render('Products/GenerateQr', [
            'product' => $product
        ]);
    }
}

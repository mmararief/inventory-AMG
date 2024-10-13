<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function create()
    {
        return Inertia::render('Categories/Create');
    }
    public function index()
    {
        $user = Auth::user();

        $categories = Category::where('retail_id', Auth::user()->retail_id)->latest()->paginate(10);
        $userStatus = $user->retail->status;


        return Inertia::render('Categories/Index', [
            'initialCategories' => $categories,
            'userStatus' => $userStatus
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Category::create(array_merge($validatedData, ['retail_id' => Auth::user()?->retail_id]));

        return redirect()->route('categories.index');
    }



    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category->update(array_merge($request->all(), ['retail_id' => Auth::user()->retail_id]));
        return redirect()->route('categories.index');
    }



    public function destroy(Category $category)
    {
        $category->delete();
    }
}

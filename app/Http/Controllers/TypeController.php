<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Type;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;

class TypeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $userStatus = $user->retail->status;
        $types = Type::where('retail_id', Auth::user()?->retail_id)
            ->with('category')
            ->get();
        $categories = Category::where('retail_id', Auth::user()?->retail_id)->get();
        return inertia::render('Type/Index', [
            'initialTypes' => $types,
            'categories' => $categories,
            'userStatus' => $userStatus
        ]);
    }
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        $type = Type::create(array_merge($validatedData, ['retail_id' => Auth::user()?->retail_id]));

        return redirect()->route('type.index')
            ->with('success', 'Type created successfully')
            ->with('newTypeId', $type->id);
    }

    public function update(Request $request, Type $type)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        $type->update($validatedData);

        return redirect()->route('type.index')->with('success', 'Type updated successfully');
    }

    public function destroy(Type $type)
    {
        $type->delete();
        return redirect()->route('type.index');
    }
}

<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Location;
use App\Models\Inventory;
use App\Models\Movements;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Support\Facades\Auth;

class InventoryController extends Controller
{
    public function stockIn(Request $request, Inventory $inventory)
    {
        $validatedData = $request->validate([
            'quantity' => 'required|integer|min:1',
            'location_id' => 'required|exists:locations,id',
        ]);



        // Update the inventory by adding the new quantity to the existing quantity
        $inventory->update([
            'quantity' => $inventory->quantity + $validatedData['quantity'],
            'location_id' => $validatedData['location_id'],
        ]);

        // Create a stock movement record
        Movements::create([
            'product_id' => $inventory->product_id,
            'to_location_id' => $validatedData['location_id'],
            'quantity' => $validatedData['quantity'],
            'type' => 'in',
            'retail_id' => Auth::user()->retail_id,
        ]);

        return redirect()->route('inventory.index')->with('success', 'Inventory updated successfully');
    }

    public function moveStock(Request $request, Inventory $inventory)
    {
        $validatedData = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'quantity' => 'required|integer|min:1|max:' . $inventory->quantity,
        ]);

        $destinationLocation = Location::findOrFail($validatedData['location_id']);
        $quantityToMove = $validatedData['quantity'];

        // Check if inventory already exists at the destination
        $existingInventory = Inventory::where('product_id', $inventory->product_id)
            ->where('location_id', $validatedData['location_id'])
            ->first();

        // Calculate remaining volume at the destination
        $productVolume = $inventory->product->volume * $quantityToMove;
        $remainingVolume = $destinationLocation->remaining_volume - $productVolume;

        if ($remainingVolume < 0) {
            return redirect()->back()->with('error', 'Not enough space in the destination location.');
        }

        // Create a stock movement record
        Movements::create([
            'product_id' => $inventory->product_id,
            'from_location_id' => $inventory->location_id,
            'to_location_id' => $validatedData['location_id'],
            'quantity' => $quantityToMove,
            'type' => 'move',
            'retail_id' => Auth::user()->retail_id,
        ]);

        if ($existingInventory) {
            // If inventory exists at destination, update quantity
            $existingInventory->increment('quantity', $quantityToMove);
        } else {
            // If no existing inventory, create a new one
            Inventory::create([
                'product_id' => $inventory->product_id,
                'location_id' => $validatedData['location_id'],
                'quantity' => $quantityToMove,
                'supplier_id' => $inventory->supplier_id,
                'retail_id' => Auth::user()->retail_id,
            ]);
        }

        // Update the original inventory
        $inventory->decrement('quantity', $quantityToMove);

        // Delete the original inventory if quantity becomes zero
        if ($inventory->quantity == 0) {
            $inventory->delete();
        }

        // Update the remaining volume of the destination location
        $destinationLocation->update([
            'remaining_volume' => $remainingVolume,
        ]);

        return redirect()->route('inventory.index')->with('success', "Stock moved successfully. Remaining volume at destination: {$remainingVolume}");
    }

    // Stock Out
    public function stockOut(Request $request, Inventory $inventory)
    {
        $retail_id = Auth::user()->retail_id;

        $validatedData = $request->validate([
            'quantity' => 'required|integer|min:1',
            'location_id' => 'required|exists:locations,id',

        ]);

        // Create a stock movement record
        Movements::create([
            'product_id' => $inventory->product_id,
            'from_location_id' => $inventory->location_id,
            'quantity' => $validatedData['quantity'],
            'type' => 'out',
            'retail_id' => $retail_id,
        ]);

        // Update the inventory by subtracting the new quantity from the existing quantity
        $inventory->update([
            'quantity' => $inventory->quantity - $validatedData['quantity'],
            'location_id' => $validatedData['location_id'],

        ]);

        return redirect()->route('inventory.index')->with('success', 'Inventory updated successfully');
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $userStatus = $user->retail->status;
        $categories = Category::where('retail_id', Auth::user()?->retail_id)->get();
        $locations = Location::where('retail_id', Auth::user()?->retail_id)->with('inventories.product')->get()->map(function ($location) {
            $remainingVolume = $location->remaining_volume;

            return [
                'id' => $location->id,
                'name' => $location->name,
                'volume' => $location->volume,
                'remaining_volume' => $remainingVolume,
                // Include other location properties as needed
            ];
        });
        $query = Inventory::with(['product.category', 'product.brand', 'product.type', 'location'])
            ->where('retail_id', Auth::user()?->retail_id);

        // Apply filters
        if ($request->has('search') && $request->search !== '') {
            $query->whereHas('product', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('product_code', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('category') && $request->category !== 'all') {
            $query->whereHas('product.category', function ($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        if ($request->has('location') && $request->location !== 'all') {
            $query->whereHas('location', function ($q) use ($request) {
                $q->where('name', $request->location);
            });
        }

        // Paginate the results
        $inventories = $query->paginate(10)->appends($request->query());
        return Inertia::render('Inventory/Index', [
            'categories' => $categories,
            'locations' => $locations,
            'inventories' => $inventories,
            'filters' => $request->only(['search', 'category', 'location']),
            'userStatus' => $userStatus
        ]);
    }

    public function create()
    {
        $products = Product::where('retail_id', Auth::user()?->retail_id)->get();
        $suppliers = Supplier::where('retail_id', Auth::user()?->retail_id)->get();
        $locations = Location::where('retail_id', Auth::user()?->retail_id)->with('inventories.product')->get()->map(function ($location) {
            $remainingVolume = $location->remaining_volume;

            return [
                'id' => $location->id,
                'name' => $location->name,
                'volume' => $location->volume,
                'remaining_volume' => $remainingVolume,
                // Include other location properties as needed
            ];
        });
        return Inertia::render('Inventory/Create', [
            'products' => $products,
            'locations' => $locations,
            'suppliers' => $suppliers
        ]);
    }

    public function store(Request $request)
    {
        $retail_id = Auth::user()->retail_id;

        $validatedData = $request->validate([
            'product_id' => 'required|exists:products,id',
            'location_id' => 'required|exists:locations,id',
            'quantity' => 'required|integer|min:0',
            'supplier_id' => 'required|exists:suppliers,id',
        ]);

        // Check if the product already exists in the inventory at the given location
        $existingInventory = Inventory::where('product_id', $validatedData['product_id'])
            ->where('location_id', $validatedData['location_id'])
            ->where('retail_id', $retail_id)
            ->first();

        if ($existingInventory) {
            // If the product exists, update the quantity
            $existingInventory->quantity += $validatedData['quantity'];
            $existingInventory->save();
            $inventory = $existingInventory;
        } else {
            // If the product doesn't exist in the inventory, create a new entry
            $inventory = Inventory::create([
                'product_id' => $validatedData['product_id'],
                'location_id' => $validatedData['location_id'],
                'quantity' => $validatedData['quantity'],
                'supplier_id' => $validatedData['supplier_id'],
                'retail_id' => $retail_id,
            ]);
        }

        // Create a new stock movement record
        Movements::create([
            'product_id' => $validatedData['product_id'],
            'to_location_id' => $validatedData['location_id'],
            'quantity' => $validatedData['quantity'],
            'type' => 'in',
            'retail_id' => $retail_id,
        ]);


        return redirect()->route('inventory.index')->with('success', 'Inventory updated successfully');
    }

    public function update(Request $request, Inventory $inventory)
    {

        $validatedData = $request->validate([
            'quantity' => 'required|integer|min:0',
            'location_id' => 'required|exists:locations,id',
        ]);

        $inventory->update($validatedData);

        return redirect()->route('inventory.index')->with('success', 'Inventory updated successfully');
    }

    public function destroy(Inventory $inventory)
    {
        $inventory->delete();
        return redirect()->route('inventory.index');
    }
}

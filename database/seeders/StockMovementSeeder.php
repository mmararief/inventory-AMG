<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Location;
use App\Models\Movements;
use Illuminate\Database\Seeder;

class StockMovementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $products = Product::first();
        $locations = Location::first();
        Movements::create([
            'product_id' => $products->id,
            'to_location_id' => $locations->id,
            'quantity' => 100,
            'type' => 'in',
        ]);
    }
}

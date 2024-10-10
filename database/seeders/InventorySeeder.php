<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Location;

class InventorySeeder extends Seeder
{
    public function run()
    {
        // Ambil product dan location pertama
        $product = Product::first();
        $location = Location::first();

        // Insert ke tabel inventory
        DB::table('inventory')->insert([
            [
                'product_id' => $product->id, // Ambil ID product
                'location_id' => $location->id, // Ambil ID location
                'quantity' => 50,
                'created_at' => now(),
                'updated_at' => now(),

            ],
        ]);
    }
}

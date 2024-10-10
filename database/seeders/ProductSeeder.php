<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Type;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $category = Category::first();
        $brand = Brand::first();
        $type = Type::first();
        Product::create([
            'name' => 'Product 1',
            'description' => 'Description 1',
            'price' => 100,
            'category_id' => $category->id,
            'brand_id' =>  $brand->id,
            'type_id' => $type->id
        ]);
    }
}

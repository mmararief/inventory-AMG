<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Type;
use App\Models\Category;

class TypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $categories = Category::first();
        Type::create([
            'name' => 'Raw Material',
            'category_id' => $categories->id,
        ]);
        Type::create([
            'name' => 'Finished Goods',
            'category_id' => $categories->id,
        ]);
    }
}

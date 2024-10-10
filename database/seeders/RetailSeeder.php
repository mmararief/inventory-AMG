<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Retail;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\Subscription;
use Carbon\Carbon;

class RetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $retail = Retail::create([
            'retail_name' => 'PT. ABC',
            'address' => 'Jl. Raya No. 1',
            'kecamatan' => 'Kecamatan ABC',
            'kelurahan' => 'Kelurahan ABC',
            'city' => 'Kota ABC',
            'province' => 'Jawa Barat',
            'country' => 'Indonesia',
            'postal_code' => '12345',
            'email' => 'admin@abc.com',
            'handphone' => '081234567890',
            'google_maps_link' => 'https://www.google.com/maps',
            'status' => 'active',
        ]);

        $user = User::create([
            'name' => 'PT. ABC',
            'email' => 'admin@abc.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'retail_id' => $retail->id,
        ]);

        $subscription = Subscription::create([
            'retail_id' => $retail->id,
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addMonths(1),
        ]);

        $user->retail()->associate($retail);
        $subscription->retail()->associate($retail);
        $user->save();
        $subscription->save();
    }
}

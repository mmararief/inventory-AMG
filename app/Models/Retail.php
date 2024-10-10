<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;


class Retail extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'retail_name',
        'address',
        'kecamatan',
        'kelurahan',
        'city',
        'province',
        'country',
        'postal_code',
        'handphone',
        'google_maps_link',
        'email',
        'status',
        // Tambahkan atribut lain yang diperlukan untuk retail
    ];

    /**
     * Get the users for the retail.
     */

    public function checkSubscriptionStatus()
    {
        $subscription = $this->subscription()->latest()->first();

        if ($subscription && Carbon::today()->greaterThan($subscription->end_date)) {
            $this->update(['status' => 'inactive']);
        } else {
            $this->update(['status' => 'active']);
        }
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class);
    }


    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }
    public function brands()
    {
        return $this->hasMany(Brand::class);
    }

    public function inventory()
    {
        return $this->hasMany(Inventory::class);
    }

    public function locations()
    {
        return $this->hasMany(Location::class);
    }

    public function stock_movements()
    {
        return $this->hasMany(Movements::class);
    }

    public function suppliers()
    {
        return $this->hasMany(Supplier::class);
    }

    public function types()
    {
        return $this->hasMany(Type::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'description', 'volume', 'retail_id'];

    // Relasi ke Inventory
    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }

    // Accessor untuk mendapatkan sisa volume
    public function getRemainingVolumeAttribute()
    {
        // Hitung total quantity dari semua inventory di lokasi ini
        $usedVolume = $this->inventories->sum('quantity');

        // Kurangi kapasitas volume dengan volume yang digunakan
        return $this->volume - $usedVolume;
    }
}

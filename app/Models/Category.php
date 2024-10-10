<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';
    protected $fillable = ['name', 'description', 'retail_id'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function types()
    {
        return $this->hasMany(Type::class);
    }
}

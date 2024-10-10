<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $table = 'subscriptions';

    protected $fillable = [
        'retail_id',
        'start_date',
        'end_date',
    ];
    public function retail()
    {
        return $this->hasOne(Retail::class);
    }
}

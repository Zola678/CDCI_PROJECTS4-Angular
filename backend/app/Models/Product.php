<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'quantity',
        'price',
        'total_price'
    ];

    // 📦 relação com User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

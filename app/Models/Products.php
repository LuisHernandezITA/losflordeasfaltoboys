<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    use HasFactory;

    public $table = 'products';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'category_id',
        'price',
        'available_stock',
        'image_primary',   // Actualizado
        'image_detail_1',  // Nuevo
        'image_detail_2',  // Nuevo
        'seller_url',      // Nuevo
        'designer',        // Nuevo
        'shipping_type',   // Nuevo
        'addition_date',
        'available',
    ];

    public function shoppingCart()
    {
        return $this->hasMany(ShoppingCart::class, 'product_id');
    }
}
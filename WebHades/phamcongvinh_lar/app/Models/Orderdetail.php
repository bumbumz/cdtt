<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Product;
class Orderdetail extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table="orderdetail";
    protected $fillable = [
        'order_id',
        'product_id',
        'qty',
        'thumbnail',
        'price',
        'amount',
        'discount',
    ];
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function product()
{
    return $this->belongsTo(Product::class);
}


}

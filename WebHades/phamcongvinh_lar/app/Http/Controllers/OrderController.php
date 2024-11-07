<?php

namespace App\Http\Controllers;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\OrderDetail;
use App\Models\ProductStore;
use App\Models\ProductSale;
class OrderController extends Controller
{

    public function store(Request $request)
    {
        $oder = new Order();
        $oder->name =  $request->name;
        $oder->user_id =  $request->user_id;
        $oder->name =  $request->name;


        $oder->phone =  $request->phone;
        $oder->email =  $request->email;
        $oder->address =  $request->address;
        $oder->note =  $request->note;

        $oder->status =  1;

        $oder->created_at =  date('Y-m-d H:i:s');
        if($oder->save())
        {
            $result =[
                'status'=>true,
                'message'=>'Thêm thành công',
                'oder'=>$oder
            ];
        }
        else
        {
            $result =[
                'status'=>false,
                'message'=>'Thêm thất bại',
                'oder'=>null
            ];
        }

        return response()->json($result);
    }
    public function createOrder(Request $request)
{
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'name' => 'required|string|max:255',
        'phone' => 'required|string|max:20',
        'email' => 'required|email|max:255',
        'address' => 'required|string|max:255',
        'products' => 'required|array',
        'products.*.product_id' => 'required|exists:product,id',
        'products.*.qty' => 'required|integer|min:1'
    ]);

    // Create a new order with user-specific information
    $order = new Order();
    $order->user_id = $request->input('user_id');
    $order->name = $request->input('name');
    $order->phone = $request->input('phone');
    $order->email = $request->input('email');
    $order->address = $request->input('address');
    $order->status = 1;
    $order->created_at = now();
    $order->save();

    $totalAmount = 0;
    $totalDiscount = 0;
    $orderDetails = [];

    foreach ($request->input('products') as $productData) {
        $productId = $productData['product_id'];
        $qty = $productData['qty'];

        // Get the product store and sale details
        $productStore = ProductStore::where('product_id', $productId)->first();
        $productSale = ProductSale::where('product_id', $productId)->first();
        $product = Product::find($productId);

        // Check if there is enough stock for this product
        if (!$productStore || $productStore->qty < $qty) {
            return response()->json([
                'status' => false,
                'message' => "Số lượng sản phẩm không đủ trong kho cho sản phẩm ID: $productId"
            ], 400);
        }

        // Calculate price, discount, and amount for the product
        $price = $product->pricebuy;
        $discount = $productSale ? $productSale->pricesale * $qty : 0;
        $amount = ($price - ($productSale ? $productSale->pricesale : 0)) * $qty;

        // Create an order detail entry
        $orderDetail = new OrderDetail();
        $orderDetail->order_id = $order->id;
        $orderDetail->product_id = $productId;
        $orderDetail->qty = $qty;
        $orderDetail->price = $price;
        $orderDetail->amount = $amount;
        $orderDetail->discount = $discount;
        $orderDetail->save();

        // Update total amount and total discount
        $totalAmount += $amount;
        $totalDiscount += $discount;
        $orderDetails[] = $orderDetail;

        // Deduct the quantity from the store
        $productStore->qty -= $qty;
        $productStore->save();
    }

    // Return the response with order and order details
    return response()->json([
        'status' => true,
        'message' => 'Đơn hàng đã được tạo thành công.',
        'order' => $order,
        'order_details' => $orderDetails,
        'total_amount' => $totalAmount,
        'total_discount' => $totalDiscount
    ]);
}
public function getUserProducts($userId)
{
    // Kiểm tra xem người dùng có tồn tại không
    $user = User::find($userId);
    if (!$user) {
        return response()->json([
            'status' => false,
            'message' => 'Người dùng không tồn tại.'
        ], 404);
    }

    // Lấy tất cả đơn hàng của người dùng cùng với thông tin chi tiết đơn hàng và sản phẩm
    $orders = Order::where('user_id', $userId)
        ->with(['orderDetails.product' => function ($query) {
            $query->join('productstore', 'product.id', '=', 'productstore.product_id')
                ->join('productimage', 'product.id', '=', 'productimage.product_id')
                ->join('productsale', 'product.id', '=', 'productsale.product_id')
                ->select(
                    'product.id',
                    'product.name',
                    'product.pricebuy',
                    'product.created_at',
                    'productimage.thumbnail',
                    'productstore.priceroot',
                    'productsale.pricesale'
                );
        }])
        ->get();

    $products = [];
    foreach ($orders as $order) {
        foreach ($order->orderDetails as $orderDetail) {
            $product = $orderDetail->product;

            $products[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'slug' => $product->slug,
                'category_id' => $product->category_id,
                'brand_id' => $product->brand_id,
                'content' => $product->content,
                'pricebuy' => $product->pricebuy,
                'created_at' => $product->created_at,
                'status' => $product->status,
                'thumbnail' => url('images/products/' . $product->thumbnail),
                'stock_qty' => $product->stock_qty,
                'priceroot' => $product->priceroot,
                'pricesale' => $product->pricesale,
                'qty' => $orderDetail->qty,
                'price' => $orderDetail->price,
                'amount' => $orderDetail->amount,
                'discount' => $orderDetail->discount
            ];
        }
    }

    return response()->json([
        'status' => true,
        'message' => 'Danh sách sản phẩm đã mua.',
        'products' => $products
    ]);
}



}

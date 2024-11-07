<?php

namespace App\Http\Controllers;

use App\Models\OrderDetail;
use App\Models\ProductStore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class OrderDetailController extends Controller
{
    public function bestseal()
    {
        $dateLimit = now()->subMonth();
        $orderdetail = OrderDetail::join('order', 'orderdetail.order_id', '=', 'order.id')
        ->join('users', 'order.user_id', '=', 'users.id')
        ->join('product', 'orderdetail.product_id', '=', 'product.id')
        ->join('productstore', 'product.id', '=', 'productstore.product_id')
        ->join('productsale', 'product.id', '=', 'productsale.product_id')
        ->join('productimage', 'product.id', '=', 'productimage.product_id')
        ->select(
            'product.id as id',
            'product.name as name',
            'product.description as description',
            'productimage.thumbnail as thumbnail',
            'product.pricebuy as pricebuy',
            'productsale.pricesale as product_sale',
            DB::raw('SUM(db_orderdetail.qty) as total_qty_sold')
        )
        ->where('order.status', '!=', 0)
        ->where('order.created_at', '>=', $dateLimit)
        ->groupBy('product.id', 'product.name','productimage.thumbnail', 'product.pricebuy', 'productsale.pricesale')
        ->orderBy('total_qty_sold', 'DESC')
        ->limit(4)
        ->get();
        foreach ($orderdetail as $product) {
            $product->thumbnail = url('images/products/' . $product->thumbnail);
        }

    return response()->json([
        'status' => true,
        'message' => 'Lấy 5 sản phẩm bán chạy nhất trong 1 tháng thành công',
        'orderdetail' => $orderdetail
    ]);

    }
    public function index()
    {
        // Sử dụng join để kết hợp dữ liệu từ bảng orderdetail, order, user và product
        $orderdetail = OrderDetail::join('order', 'orderdetail.order_id', '=', 'order.id')
            ->join('users', 'order.user_id', '=', 'users.id') // Sửa tên bảng
            ->join('product', 'orderdetail.product_id', '=', 'product.id')
            ->join('productstore', 'product.id', '=', 'productstore.product_id')
            ->join('productsale', 'product.id', '=', 'productsale.product_id')
            ->select(
                'orderdetail.id',
                'orderdetail.qty',
                'orderdetail.amount',
                'orderdetail.discount',
                'users.id as user_id',
                'users.name as user_name',
                'users.email as user_email',
                'users.phone as user_phone',
                'users.address as user_address',
                'product.name as product_name',
                'product.pricebuy as product_price',
                'productsale.pricesale as product_sale',

            )
            ->where('order.status', '!=', 0)
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu sản phẩm thành công',
            'orderdetail' => $orderdetail
        ]);
    }
    public function update(Request $request, $id)
    {
        // Validate đầu vào
        $request->validate([
            'qty' => 'required|integer|min:1'
        ]);

        // Tìm OrderDetail theo id
        $orderDetail = OrderDetail::find($id);
        if (!$orderDetail) {
            return response()->json([
                'status' => false,
                'message' => 'Chi tiết đơn hàng không tồn tại.'
            ], 404);
        }

        // Tìm sản phẩm trong kho để kiểm tra số lượng
        $productStore = ProductStore::where('product_id', $orderDetail->product_id)->first();
        if (!$productStore || $productStore->qty < ($request->qty - $orderDetail->qty)) {
            return response()->json([
                'status' => false,
                'message' => 'Số lượng sản phẩm không đủ trong kho.'
            ], 400);
        }

        // Cập nhật chi tiết đơn hàng
        $orderDetail->qty = $request->input('qty');

        $orderDetail->amount = $orderDetail->price * $orderDetail->qty;
        $orderDetail->save();

        // Cập nhật số lượng sản phẩm trong kho
        $productStore->qty -= ($request->qty - $orderDetail->qty);
        $productStore->save();

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật chi tiết đơn hàng thành công.',
            'order_detail' => $orderDetail
        ]);
    }
}

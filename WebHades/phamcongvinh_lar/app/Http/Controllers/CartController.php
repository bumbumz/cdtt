<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductStore;
use App\Models\ProductSale;
use Illuminate\Support\Facades\DB; // Add this line
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    // Thêm sản phẩm vào giỏ hàng
    public function store(Request $request)
    {
        // Lấy thông tin người dùng đang đăng nhập
        $user = Auth::user();

        // Xác thực dữ liệu đầu vào
        $validate = Validator::make($request->all(), [
            'product_id' => 'required|exists:product,id',
            'qty' => 'required|integer|min:1'
        ]);

        if ($validate->fails()) {
            return response()->json(['error' => $validate->errors()], 401);
        }

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng của người dùng chưa
        $cartItem = Cart::where('user_id', $user->id)
                        ->where('product_id', $request->product_id)
                        ->first();

        if ($cartItem) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng
            $cartItem->qty += $request->qty;
            $cartItem->save();

            return response()->json([
                'status' => true,
                'message' => 'Số lượng sản phẩm đã được cập nhật trong giỏ hàng.'
            ], 200);
        } else {
            // Nếu sản phẩm chưa tồn tại, tạo bản ghi mới
            Cart::create([
                'user_id' => $user->id,
                'product_id' => $request->product_id,
                'qty' => $request->qty
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Sản phẩm đã được thêm vào giỏ hàng thành công.'
            ], 201);
        }
    }

    // Hiển thị giỏ hàng của một người dùng
    public function index()
    {
        $user = Auth::user();

        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Người dùng chưa đăng nhập.'
            ], 401);
        }

        // Sử dụng join để lấy thêm thông tin sản phẩm
        $cartItems = Cart::where('user_id', $user->id)
            ->join('product as product', 'cart.product_id', '=', 'product.id')
            ->join('productimage as productImage', 'product.id', '=', 'productImage.product_id')
            ->join('productstore as productStore', 'product.id', '=', 'productStore.product_id')
            ->join('productsale as productSale', 'product.id', '=', 'productSale.product_id')
            ->select(
                'cart.*', // Lấy tất cả các trường từ bảng cart
                'product.name',

                'product.pricebuy', // Đảm bảo đây là tên cột đúng
                'productSale.pricesale',
                'productSale.datebegin',
                'productSale.dateend',
                'productImage.thumbnail',

            )
            ->get();

        // Thay đổi đường dẫn của hình ảnh
        foreach ($cartItems as $product) {
            $product->thumbnail = url('images/products/' . $product->thumbnail);
        }

        if ($cartItems->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Giỏ hàng trống.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'cart' => $cartItems
        ], 200);
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    public function update(Request $request, $id)
    {
        // Validate the incoming request data
        $request->validate([
            'qty' => 'required|integer|min:1'
        ]);

        // Tìm sản phẩm trong giỏ hàng
        $cartItem = Cart::find($id);

        if (!$cartItem) {
            return response()->json([
                'status' => false,
                'message' => 'Sản phẩm không tồn tại trong giỏ hàng.'
            ], 404);
        }

        // Cập nhật số lượng sản phẩm
        $cartItem->qty = $request->qty;
        $cartItem->save();

        return response()->json([
            'status' => true,
            'message' => 'Số lượng sản phẩm đã được cập nhật thành công.'
        ], 200);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public function destroy($id)
    {
        // Tìm sản phẩm trong giỏ hàng
        $cartItem = Cart::find($id);

        if (!$cartItem) {
            return response()->json([
                'status' => false,
                'message' => 'Sản phẩm không tồn tại trong giỏ hàng.'
            ], 404);
        }

        // Xóa sản phẩm
        $cartItem->delete();

        return response()->json([
            'status' => true,
            'message' => 'Sản phẩm đã được xóa thành công.'
        ], 200);
    }
}


<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductStore;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSale;
class ProductStoreController extends Controller
{
    public function getAllProductStore()
    {
        $productStore = ProductStore::join('product', 'productstore.product_id', '=', 'product.id')
        ->join('productimage', 'productstore.product_id', '=', 'productimage.product_id')
        ->select(
            'productstore.id',
            'productstore.product_id',
            'product.name',
            'productstore.priceroot',
            'productstore.qty',
            'productstore.dateimport',
            'productstore.created_at',
            'productstore.created_by',
            'productstore.updated_at',
            'productstore.updated_by',
            'productstore.status',
            'productimage.thumbnail'
        )
        ->where('product.status', '!=', 0)
        ->get();
        foreach ($productStore as $product) {
            $product->thumbnail = url('images/products/' . $product->thumbnail); // Thêm URL đầy đủ cho thumbnail
        }
        return response()->json($productStore, 200);
    }

    public function updateProductStatus(Request $request, $id)
    {
        $productStore = ProductStore::find($id);


        if ($productStore == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'productStore' => null
            ]);
        }

        if (!in_array($request->status, [2, 1])) {
            return response()->json([
                'status' => false,
                'message' => 'Status chỉ nhận giá trị 1 hoặc 0',
                'productStore' => null
            ]);
        }

        $productStore->status = $request->status;


        if ($productStore->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Sửa thành công',
                'productStore' => $productStore
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Sửa thất bại',
                'productStore' => null
            ]);
        }
    }
    public function updateProductStore(Request $request, $id)
    {
        $productStore = ProductStore::find($id);

        // Kiểm tra xem bản ghi có tồn tại không
        if ($productStore == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'productStore' => null
            ];
        } else {
            // Cập nhật thông tin sản phẩm giảm giá

            $productStore->priceroot = $request->priceroot;
            $productStore->qty = $request->qty;
            // Cập nhật thông tin trạng thái, người sửa, và thời gian sửa
            $productStore->updated_by = 1; // Bạn có thể thay đổi `updated_by` theo logic của bạn
            $productStore->updated_at = now();
            //$productStore->status = 1;

            $check_save = false;

            // Lưu bản ghi
            if ($productStore->save()) {
                $result = [
                    'status' => true,
                    'message' => 'Sửa thành công',
                    'productStore' => $productStore
                ];
            } else {
                $result = [
                    'status' => false,
                    'message' => 'Sửa thất bại',
                    'productStore' => null
                ];
            }
        }

        return response()->json($result);

    }
    public function getProductStore($id)
    {
        $productStore = ProductStore::find($id);
        if ($productStore) {
            return response()->json($productStore, 200);
        } else {
            return response()->json(['message' => 'Product sale not found'], 404);
        }
    }

    public function store(Request $request)
    {
        // Thêm sản phẩm vào bảng 'product'
        $product = new Product();
        $product->name = $request->name;
        $product->slug = $request->slug;
        $product->category_id = $request->category_id;
        $product->brand_id = $request->brand_id;
        $product->content = $request->content;
        $product->description = $request->description;
        $product->pricebuy = $request->pricebuy;
        $product->created_by = 1; // Đặt giá trị mặc định hoặc từ auth user
        $product->status = $request->status ?? 1;
        $product->save();

        // Thêm dữ liệu vào bảng 'db_productstore'
        $productStore = new ProductStore();
        $productStore->product_id = $product->id;
        $productStore->priceroot = $request->priceroot;
        $productStore->qty = $request->qty;
        $productStore->dateimport = now(); // Sử dụng thời gian hiện tại
        $productStore->created_by = 1; // Đặt giá trị mặc định hoặc từ auth user
        $productStore->status = $request->status ?? 2;
        $productStore->save();

        $productSale = new ProductSale();
        $productSale->product_id = $product->id;
        $productSale->pricesale = 0;

        $productSale->created_by = 1; // Đặt giá trị mặc định hoặc từ auth user
        $productSale->status = $request->status ?? 2;
        $productSale->save();

        // Xử lý ảnh nếu có
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = date('YmdHis') . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/products'), $imageName);
            $productImage = new ProductImage();
            $productImage->product_id = $product->id;
            $productImage->thumbnail = $imageName;
            $productImage->save();
        }

        return response()->json([
            'status' => true,
            'message' => 'Thêm sản phẩm và dữ liệu kho thành công',
            'product' => $product,
            'product_store' => $productStore,
            'product_image' => $productImage ?? null
        ]);
    }
}

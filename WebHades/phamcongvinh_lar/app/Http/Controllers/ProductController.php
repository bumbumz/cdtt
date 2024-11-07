<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductStore;
use App\Models\ProductSale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
{

     $products = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
     ->join('productimage', 'product.id', '=', 'productimage.product_id')
     ->join('productsale', 'product.id', '=', 'productsale.product_id')

     ->select(
         'product.id',
         'product.name',
         'product.slug',
         'product.category_id',
         'product.brand_id',
         'product.content',
         'product.pricebuy',
         'product.description',
         'product.created_at',
         'product.created_by',
         'product.updated_at',
         'product.updated_by',
         'product.status',
         'productimage.thumbnail',
         'productstore.qty',
         'productstore.priceroot',
         'productsale.pricesale',
     )
     ->where('product.status', '!=', 0 )
     ->where('productstore.status', '!=', 2 )
     ->get();
     foreach ($products as $product) {
        $product->thumbnail = url('images/products/' . $product->thumbnail);
    }


 return response()->json([
     'status' => true,
     'message' => 'Tải dữ liệu sản phẩm thành công',
     'products' => $products
 ]);
}



public function getTrash()
{

     $products = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
     ->join('productimage', 'product.id', '=', 'productimage.product_id')
     ->join('productsale', 'product.id', '=', 'productsale.product_id')

     ->select(
         'product.id',
         'product.name',
         'product.slug',
         'product.category_id',
         'product.brand_id',
         'product.content',
         'product.pricebuy',
         'product.description',
         'product.created_at',
         'product.created_by',
         'product.updated_at',
         'product.updated_by',
         'product.status',
         'productimage.thumbnail',
         'productstore.qty',
         'productstore.priceroot',
         'productsale.pricesale',
     )
     ->where('product.status', '=', 0 )
     ->where('productstore.status', '=', 0 )
     ->get();
     foreach ($products as $product) {
        $product->thumbnail = url('images/products/' . $product->thumbnail);
    }


 return response()->json([
     'status' => true,
     'message' => 'Tải dữ liệu sản phẩm thành công',
     'products' => $products
 ]);
}

public function upTrash($id)
{
    try {
        // Cập nhật status của sản phẩm trong bảng product
        Product::where('id', $id)->update(['status' => 0]);

        // Cập nhật status trong bảng productstore
        ProductStore::where('product_id', $id)->update(['status' => 0]);


        // Cập nhật status trong bảng productsale
        ProductSale::where('product_id', $id)->update(['status' => 0]);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật trạng thái thành công cho các bảng liên quan',
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
        ], 500);
    }
}public function toggleStatusOrDelete($id)
{
    try {
        // Lấy sản phẩm theo ID
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm.',
            ], 404);
        }

        if ($product->status == 0) {
            // Xóa các bản ghi liên quan trước
            ProductImage::where('product_id', $id)->delete();
            ProductStore::where('product_id', $id)->delete();
            ProductSale::where('product_id', $id)->delete();

            // Sau đó xóa sản phẩm
            $product->delete();

            $message = 'Đã xóa sản phẩm và các bản ghi liên quan.';
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Trạng thái không hợp lệ.',
            ], 400);
        }

        return response()->json([
            'status' => true,
            'message' => $message,
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
        ], 500);
    }
}



public function toggleStatus($id)
{
    try {
        // Lấy status hiện tại của sản phẩm
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm.',
            ], 404);
        }

        // Xác định status mới
        $newStatus = $product->status == 1 ? 2 : 1;

        // Cập nhật status của sản phẩm trong bảng product
        $product->update(['status' => $newStatus]);

        // Cập nhật status trong bảng productstore
        ProductStore::where('product_id', $id)->update(['status' => $newStatus]);

        // Cập nhật status trong bảng productsale
        ProductSale::where('product_id', $id)->update(['status' => $newStatus]);

        return response()->json([
            'status' => true,
            'message' => 'Đã cập nhật trạng thái thành công.',
            'newStatus' => $newStatus,
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
        ], 500);
    }
}





    public function store(Request $request)
    {

        $product = new Product();
        $product->name = $request->name;
        $product->slug = $request->slug;
        $product->category_id = $request->category_id;
        $product->brand_id = $request->brand_id;
        $product->content = $request->content;
        $product->description = $request->description;
        $product->pricebuy = $request->pricebuy;
        $product->created_by = 1;
        $product->status = $request->status ?? 1;
        $product->save();

        $productStore = new ProductStore();
        $productStore->product_id = $product->id;
        $productStore->priceroot = $request->priceroot;
        $productStore->qty = $request->qty;
        $productStore->dateimport = now();
        $productStore->created_by = 1;
        $productStore->status = $request->status ?? 1;
        $productStore->save();

        $productSale = new ProductSale();
        $productSale->product_id = $product->id;
        $productSale->pricesale = 0;

        $productSale->created_by = 1;
        $productSale->status = $request->status ?? 1;
        $productSale->save();

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

    public function getProductNew(Request $request)
    {
        $dateLimit = now()->subDays(15);
        //mốc thời gian là 15 ngày trước tính từ thời điểm hiện tại.

        // Số lượng sản phẩm mỗi lần tải (mặc định là 4)
        $limit = 4;

        // Lấy offset từ query parameters, mặc định là 0
        $offset = $request->query('offset', 0);

        // Lấy sản phẩm dựa trên điều kiện
        $products = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
        ->join('productimage', 'product.id', '=', 'productimage.product_id')
        ->join('productsale', 'product.id', '=', 'productsale.product_id')

        ->select(
            'product.id',
            'product.name',
            'product.slug',
            'product.category_id',
            'product.brand_id',
            'product.content',
            'product.pricebuy',
            'product.description',
            'product.created_at',
            'product.created_by',
            'product.updated_at',
            'product.updated_by',
            'product.status',
            'productimage.thumbnail',
            'productstore.qty',
            'productstore.priceroot',
            'productsale.pricesale',
        )
            ->where('product.status', '!=', 0)
            ->where('product.created_at', '>=', $dateLimit) // Điều kiện để lấy sản phẩm mới bán

            ->skip($offset) // Bỏ qua số sản phẩm đã lấy trước đó
            ->take($limit) // Giới hạn số sản phẩm lấy
            ->get();

        // Cập nhật đường dẫn ảnh cho từng sản phẩm
        foreach ($products as $product) {
            $product->thumbnail = url('images/products/' . $product->thumbnail);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu sản phẩm thành công',
            'products' => $products,
            'hasMore' => $products->count() === $limit // Kiểm tra xem còn sản phẩm nữa không
        ]);
    }





    public function showRelatedProducts($id, Request $request)
{
    // Tìm sản phẩm với id truyền vào để lấy category_id
    $product = Product::find($id);

    if (!$product) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy sản phẩm'
        ]);
    }

    // Số lượng sản phẩm mỗi lần tải (mặc định là 4)
    $limit = 4;

    // Lấy offset từ query parameters, mặc định là 0
    $offset = $request->query('offset', 0);

    // Lấy các sản phẩm cùng category_id nhưng khác id truyền vào
    $relatedProducts = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
        ->join('productimage', 'product.id', '=', 'productimage.product_id')
        ->select(
            'product.id',
            'product.name',
            'product.slug',
            'product.category_id',
            'product.brand_id',
            'product.content',
            'product.pricebuy',
            'product.description',
            'product.created_at',
            'product.created_by',
            'product.updated_at',
            'product.updated_by',
            'product.status',
            'productimage.thumbnail',
            'productstore.qty',
            'productstore.priceroot'
        )
        ->where('product.category_id', $product->category_id)
        ->where('product.id', '!=', $id)  // Lọc để loại bỏ sản phẩm có id truyền vào
        ->where('product.status', '!=', 0)
        ->where('productstore.status', '!=', 2)
        ->skip($offset) // Bỏ qua số sản phẩm đã lấy trước đó
        ->take($limit) // Giới hạn số sản phẩm lấy
        ->get();

    // Kiểm tra xem có sản phẩm nào liên quan không
    if ($relatedProducts->isEmpty()) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy sản phẩm liên quan',
        ]);
    }

    // Thêm URL đầy đủ cho thumbnail
    foreach ($relatedProducts as $relatedProduct) {
        $relatedProduct->thumbnail = url('images/products/' . $relatedProduct->thumbnail);
    }

    return response()->json([
        'status' => true,
        'message' => 'Tải dữ liệu sản phẩm liên quan thành công',
        'products' => $relatedProducts,
        'hasMore' => $relatedProducts->count() === $limit // Kiểm tra xem còn sản phẩm nữa không
    ]);
}




    public function indexFrontend()
    {

        $products = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
            ->join('productimage', 'product.id', '=', 'productimage.product_id')
            ->orderBy('product.created_at', 'DESC')
            ->select(
                'product.id',
                'product.name',
                'product.category_id',
                'product.pricebuy',
                'product.description',
                'productimage.thumbnail',
                'productstore.qty'
            )
            ->where('product.status', '=', 1)
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu sản phẩm thành công',
            'products' => $products
        ]);
    }

    public function update(Request $request, $id)
    {

        $product = Product::find($id);

        if ($product == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm',
                'product' => null
            ]);
        }


        $product->name = $request->name ?? $product->name;
        $product->slug = $request->slug ?? $product->slug;
        $product->category_id = $request->category_id ?? $product->category_id;
        $product->brand_id = $request->brand_id ?? $product->brand_id;
        $product->content = $request->content ?? $product->content;
        $product->description = $request->description ?? $product->description;
        $product->pricebuy = $request->pricebuy ?? $product->pricebuy;

        $product->updated_by = 1;
        $product->updated_at = now();
        $product->status = $request->status ?? $product->status;
        $product->save();

        // // Cập nhật thông tin productstore
        // $productStore = ProductStore::where('product_id', $product->id)->first();
        // if ($productStore) {
        //     $productStore->priceroot = $request->priceroot ?? $productStore->priceroot;
        //     $productStore->qty = $request->qty ?? $productStore->qty;
        //     $productStore->updated_at = now();
        //     $productStore->save();
        // }

        // Cập nhật ảnh nếu có
        if ($request->hasFile('image')) {
            // Xóa ảnh cũ (nếu cần)
            if ($product->thumbnail && file_exists(public_path('images/products/' . $product->thumbnail))) {
                unlink(public_path('images/products/' . $product->thumbnail));
            }

            $image = $request->file('image');
            $imageName = date('YmdHis') . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/products'), $imageName);

            $productImage = ProductImage::where('product_id', $product->id)->first();
            if ($productImage) {
                $productImage->thumbnail = $imageName;
                $productImage->save();
            } else {
                $productImage = new ProductImage();
                $productImage->product_id = $product->id;
                $productImage->thumbnail = $imageName;
                $productImage->save();
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật sản phẩm thành công',
            'product' => $product,
            // 'product_store' => $productStore,
            // 'product_image' => $productImage ?? null
        ]);
    }



public function show($id)
{
    // Sử dụng join để kết hợp dữ liệu từ bảng product, productstore và productimage
    $product = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
        ->join('productimage', 'product.id', '=', 'productimage.product_id') // kết nối với bảng productimage có id bằng product_id
        ->select(
            'product.id',
            'product.name',
            'product.slug',
            'product.category_id',
            'product.brand_id',
            'product.content',
            'product.pricebuy',
            'product.description',
            'product.created_at',
            'product.created_by',
            'product.updated_at',
            'product.updated_by',
            'product.status',
            'productimage.thumbnail', // Lấy thumbnail từ bảng productimage
            'productstore.qty',
            'productstore.priceroot'
        )
        ->where('product.id', $id)
        ->first();

    // Kiểm tra xem sản phẩm có tồn tại không
    if (!$product) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy sản phẩm'
        ]);
    }

    // Thêm URL đầy đủ cho thumbnail
    $product->thumbnail = url('images/products/' . $product->thumbnail);

    return response()->json([
        'status' => true,
        'message' => 'Tải dữ liệu sản phẩm thành công',
        'product' => $product
    ]);
}

public function showIdCate($id)
{
    // Nếu $id = 0, lấy tất cả sản phẩm (giống như hàm index)
    if ($id == 0) {
        $products = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
            ->join('productimage', 'product.id', '=', 'productimage.product_id')
            ->select(
                'product.id',
                'product.name',
                'product.slug',
                'product.category_id',
                'product.brand_id',
                'product.content',
                'product.pricebuy',
                'product.description',
                'product.created_at',
                'product.created_by',
                'product.updated_at',
                'product.updated_by',
                'product.status',
                'productimage.thumbnail',
                'productstore.qty',
                'productstore.priceroot'
            )
            ->where('product.status', '!=', 0)
            ->where('productstore.status', '!=', 2)
            ->get();
    } else {
        // Lấy sản phẩm theo category_id
        $products = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
            ->join('productimage', 'product.id', '=', 'productimage.product_id')
            ->select(
                'product.id',
                'product.name',
                'product.slug',
                'product.category_id',
                'product.brand_id',
                'product.content',
                'product.pricebuy',
                'product.description',
                'product.created_at',
                'product.created_by',
                'product.updated_at',
                'product.updated_by',
                'product.status',
                'productimage.thumbnail',
                'productstore.qty',
                'productstore.priceroot'
            )
            ->where('product.category_id', $id)
            ->where('product.status', '!=', 0)
            ->where('productstore.status', '!=', 2)
            ->get();
    }

    // Kiểm tra xem có sản phẩm nào không
    if ($products->isEmpty()) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy sản phẩm',
        ]);
    }

    // Thêm URL đầy đủ cho thumbnail
    foreach ($products as $product) {
        $product->thumbnail = url('images/products/' . $product->thumbnail);
    }

    // Trả về JSON với danh sách sản phẩm
    return response()->json([
        'status' => true,
        'message' => 'Tải dữ liệu sản phẩm thành công',
        'products' => $products,
    ]);
}

public function getRelatedProducts($categoryId, $currentProductId, Request $request)
{
    // Số lượng sản phẩm mỗi lần lấy (mặc định là 4)
    $limit = 4;

    // Lấy offset từ query parameters, mặc định là 0
    $offset = $request->query('offset', 0);

    $relatedProducts = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
        ->join('productimage', 'product.id', '=', 'productimage.product_id')
        ->select(
            'product.id',
            'product.name',
            'product.slug',
            'product.category_id',
            'product.brand_id',
            'product.content',
            'product.pricebuy',
            'product.description',
            'product.created_at',
            'product.created_by',
            'product.updated_at',
            'product.updated_by',
            'product.status',
            'productimage.thumbnail', // Lấy thumbnail từ bảng productimage
            'productstore.qty',
            'productstore.priceroot'
        )
        ->where('product.category_id', $categoryId)
        ->where('product.id', '!=', $currentProductId)
        ->where('product.status', '!=', 0)
        ->skip($offset) // Bỏ qua các sản phẩm đã lấy trước đó
        ->take($limit)  // Giới hạn số sản phẩm lấy
        ->get();

    // Thêm URL đầy đủ cho thumbnail
    foreach ($relatedProducts as $product) {
        $product->thumbnail = url('images/products/' . $product->thumbnail);
    }

    return response()->json([
        'status' => true,
        'message' => 'Tải sản phẩm liên quan thành công',
        'relatedProducts' => $relatedProducts,
        'hasMore' => $relatedProducts->count() === $limit // Kiểm tra xem có còn sản phẩm nữa không
    ]);
}
public function getProductsByCategoryId($categoryId, Request $request)
{
    // Số lượng sản phẩm mỗi lần lấy (mặc định là 4)
    $limit = 4;

    // Lấy offset từ query parameters, mặc định là 0
    $offset = $request->query('offset', 0);

    // Lấy sản phẩm theo category ID
    $products = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
        ->join('productimage', 'product.id', '=', 'productimage.product_id')
        ->select(
            'product.id',
            'product.name',
            'product.slug',
            'product.category_id',
            'product.brand_id',
            'product.content',
            'product.pricebuy',
            'product.description',
            'product.created_at',
            'product.created_by',
            'product.updated_at',
            'product.updated_by',
            'product.status',
            'productimage.thumbnail', // Lấy thumbnail từ bảng productimage
            'productstore.qty',
            'productstore.priceroot'
        )
        ->where('product.category_id', $categoryId)
        ->where('product.status', '!=', 0)
        ->skip($offset) // Bỏ qua các sản phẩm đã lấy trước đó
        ->take($limit)  // Giới hạn số sản phẩm lấy
        ->get();

    // Thêm URL đầy đủ cho thumbnail
    foreach ($products as $product) {
        $product->thumbnail = url('images/products/' . $product->thumbnail);
    }

    return response()->json([
        'status' => true,
        'message' => 'Tải sản phẩm theo danh mục thành công',
        'products' => $products,
        'hasMore' => $products->count() === $limit // Kiểm tra xem có còn sản phẩm nữa không
    ]);
}

public function getProducts(Request $request)
{
    // Số lượng sản phẩm mỗi lần lấy (mặc định là 4)
    $limit = 4;

    // Lấy offset từ query parameters, mặc định là 0
    $offset = $request->query('offset', 0);

    // Lấy tất cả sản phẩm
    $products = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
        ->join('productimage', 'product.id', '=', 'productimage.product_id')
        ->select(
            'product.id',
            'product.name',
            'product.slug',
            'product.category_id',
            'product.brand_id',
            'product.content',
            'product.pricebuy',
            'product.description',
            'product.created_at',
            'product.created_by',
            'product.updated_at',
            'product.updated_by',
            'product.status',
            'productimage.thumbnail', // Lấy thumbnail từ bảng productimage
            'productstore.qty',
            'productstore.priceroot'
        )
        ->where('product.status', '!=', 0) // Đảm bảo sản phẩm có trạng thái khác 0
        ->skip($offset) // Bỏ qua các sản phẩm đã lấy trước đó
        ->take($limit)  // Giới hạn số sản phẩm lấy
        ->get();

    // Thêm URL đầy đủ cho thumbnail
    foreach ($products as $product) {
        $product->thumbnail = url('images/products/' . $product->thumbnail);
    }

    return response()->json([
        'status' => true,
        'message' => 'Tải sản phẩm thành công',
        'products' => $products,
        'hasMore' => $products->count() === $limit // Kiểm tra xem có còn sản phẩm nữa không
    ]);
}


public function showIdCates(Request $request)
{
    // Get filter options from the request
    $ids = $request->input('ids'); // Category IDs (array)
    $minPrice = $request->input('min_price'); // Minimum price
    $maxPrice = $request->input('max_price'); // Maximum price
    $brandIds = $request->input('brand_ids'); // Brand IDs (array)

    // Build the base query
    $query = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
        ->join('productimage', 'product.id', '=', 'productimage.product_id')
        ->select(
            'product.id',
            'product.name',
            'product.slug',
            'product.category_id',
            'product.brand_id',
            'product.content',
            'product.pricebuy',
            'product.description',
            'product.created_at',
            'product.created_by',
            'product.updated_at',
            'product.updated_by',
            'product.status',
            'productimage.thumbnail',
            'productstore.qty',
            'productstore.priceroot'
        )
        ->where('product.status', '!=', 0)
        ->where('productstore.status', '!=', 2);

    // Apply category filter if category IDs are provided
    if (!empty($ids)) {
        $query->whereIn('product.category_id', $ids);
    }

    // Apply price filters if specified
    if ($minPrice !== null) {
        $query->where('productstore.priceroot', '>=', $minPrice);
    }
    if ($maxPrice !== null) {
        $query->where('productstore.priceroot', '<=', $maxPrice);
    }

    // Apply brand filter if brand IDs are provided
    if (!empty($brandIds)) {
        $query->whereIn('product.brand_id', $brandIds);
    }

    // Execute the query and get results
    $products = $query->get();
    foreach ($products as $product) {
        $product->thumbnail = url('images/products/' . $product->thumbnail);
    }

    return response()->json([
        'status' => true,
        'message' => 'Lấy danh sách sản phẩm thành công',
        'products' => $products
    ]);
}



public function updatePStatus(Request $request, $id)
{
    $product = Product::find($id);


    if ($product == null) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy dữ liệu',
            'product' => null
        ]);
    }

    if (!in_array($request->status, [2, 1])) {
        return response()->json([
            'status' => false,
            'message' => 'Status chỉ nhận giá trị 1 hoặc 0',
            'product' => null
        ]);
    }

    $product->status = $request->status;


    if ($product->save()) {
        return response()->json([
            'status' => true,
            'message' => 'Sửa thành công',
            'product' => $product
        ]);
    } else {
        return response()->json([
            'status' => false,
            'message' => 'Sửa thất bại',
            'product' => null
        ]);
    }
}

}

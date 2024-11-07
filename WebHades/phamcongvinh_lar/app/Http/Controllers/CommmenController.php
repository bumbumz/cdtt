<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commen;

use Illuminate\Support\Facades\Validator;
class CommmenController extends Controller
{
    public function index($product_id)
    {
        $comments = Commen::with('user') // Tải trước người dùng
            ->where('product_id', $product_id)
            ->get();

        // Chuyển đổi hình ảnh của bình luận
        foreach ($comments as $comment) {
            $comment->image = url('images/comments/' . $comment->image);
            // Lấy tên và thumbnail của người dùng
            if ($comment->user) {
                $comment->username = $comment->user->username; // Thêm tên người dùng
                $comment->thumbnail = url('images/user/' . $comment->user->thumbnail); // Thêm thumbnail
            }
            unset($comment->user); // Xóa thuộc tính user nếu không cần thiết
        }

        return response()->json([
            'success' => true,
            'comments' => $comments
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer',
            'user_id' => 'required|integer',
            'conten' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Xử lý lưu hình ảnh nếu có
        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = date('YmdHis') . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/comments'), $imageName);
            $imagePath =  $imageName; // Đường dẫn lưu vào database
        }

        // Tạo comment mới
        $comment = new Commen();
        $comment->product_id = $request->product_id;
        $comment->user_id = $request->user_id;
        $comment->conten = $request->conten;
        $comment->image = $imagePath; // Gán đường dẫn hình ảnh vào comment
        $comment->save();

        return response()->json([
            'success' => true,
            'message' => 'Comment created successfully',
            'data' => $comment
        ], 201);
    }


}

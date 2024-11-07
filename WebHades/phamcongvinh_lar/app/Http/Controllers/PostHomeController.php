<?php

namespace App\Http\Controllers;

use App\Models\PostHome;
use Illuminate\Http\Request;

class PostHomeController extends Controller
{
    public function index()
    {
        $posts = PostHome::where('status', '!=', 0)
            ->orderBy('id', 'DESC')
            ->select("id", "name", "image", "conten", "status")
            ->get();
            foreach ($posts as $post) {
                $post->image = url('images/post/' . $post->image);
            }


        $result = $posts->isEmpty() ? [
            'status' => false,
            'message' => 'Không tìm thấy dữ liệu',
            'postshome' => null
        ] : [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'postshome' => $posts
        ];

        return response()->json($result);
    }
    public function indexFonend()
    {
        $posts = PostHome::where('status', '=', 1)
            ->orderBy('id', 'DESC')
            ->select("id", "name", "image", "conten", "status")
            ->get();
            foreach ($posts as $post) {
                $post->image = url('images/post/' . $post->image);
            }


        $result = $posts->isEmpty() ? [
            'status' => false,
            'message' => 'Không tìm thấy dữ liệu',
            'postshome' => null
        ] : [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'postshome' => $posts
        ];

        return response()->json($result);
    }

    public function trash()
    {
        $posts = PostHome::where('status', '=', 0)
            ->orderBy('id', 'DESC')
            ->select("id", "name", "image", "conten", "status")
            ->get();

        $result = $posts->isEmpty() ? [
            'status' => false,
            'message' => 'Không tìm thấy dữ liệu',
            'posts' => null
        ] : [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'posts' => $posts
        ];

        return response()->json($result);
    }

    public function show($id)
    {
        $post = PostHome::select("id", "name", "image", "conten", "status")->find($id);

        $result = is_null($post) ? [
            'status' => false,
            'message' => 'Không tìm thấy dữ liệu',
            'post' => null
        ] : [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'post' => $post
        ];

        return response()->json($result);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'conten' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,png,webp,gif|max:2048',
        ]);

        $post = new PostHome();
        $post->name = $request->name;
        $post->conten = $request->conten;

        if ($request->hasFile('image')) {
            $imageName = date('YmdHis') . "." . $request->image->extension();
            $request->image->move(public_path('images/post'), $imageName);
            $post->image = $imageName;
        }

        $post->status = 1;

        $result = $post->save() ? [
            'status' => true,
            'message' => 'Thêm thành công',
            'post' => $post
        ] : [
            'status' => false,
            'message' => 'Thêm thất bại',
            'post' => null
        ];

        return response()->json($result);
    }

    public function update(Request $request, $id)
    {
        $post = PostHome::find($id);

        if (is_null($post)) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'post' => null
            ]);
        }

        $request->validate([
            'name' => 'required|string',
            'conten' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,png,webp,gif|max:2048',
        ]);

        $post->name = $request->name;
        $post->conten = $request->conten;

        if ($request->hasFile('image')) {
            if ($post->image && file_exists(public_path('images/post/' . $post->image))) {
                unlink(public_path('images/post/' . $post->image));
            }

            $imageName = date('YmdHis') . "." . $request->image->extension();
            $request->image->move(public_path('images/post'), $imageName);
            $post->image = $imageName;
        }

        $post->status = 1;

        $post->save();

        return response()->json([
            'status' => true,
            'message' => 'Sửa thành công',
            'post' => $post
        ]);
    }

    public function status(Request $request,$id)
    {
        $product = PostHome::find($id);

        if ($product == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'posts' => null
            ]);
        }

        if (!in_array($request->status, [2, 1])) {
            return response()->json([
                'status' => false,
                'message' => 'Status chỉ nhận giá trị 1 hoặc 0',
                'posts' => null
            ]);
        }

        $product->status = $request->status;


        if ($product->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Sửa thành công',
                'posts' => $product
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Sửa thất bại',
                'posts' => null
            ]);
        }

    }

    public function delete($id)
    {
        $post = PostHome::find($id);

        if (is_null($post) || $post->status != 1) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'post' => null
            ]);
        }

        $post->status = 0;
        $post->save();

        return response()->json([
            'status' => true,
            'message' => 'Dữ liệu đưa vào thùng rác thành công',
            'post' => $post
        ]);
    }

    public function restore($id)
    {
        $post = PostHome::find($id);

        if (is_null($post) || $post->status != 0) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'post' => null
            ]);
        }

        $post->status = 1;
        $post->save();

        return response()->json([
            'status' => true,
            'message' => 'Khôi phục dữ liệu thành công',
            'post' => $post
        ]);
    }

    public function destroy($id)
    {
        $post = PostHome::find($id);

        if (is_null($post) || $post->status != 1) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'post' => null
            ]);
        }

        $post->status = 2;
        $post->save();

        return response()->json([
            'status' => true,
            'message' => 'Xóa dữ liệu thành công',
            'post' => $post
        ]);
    }
}

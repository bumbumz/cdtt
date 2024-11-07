<?php

namespace App\Http\Controllers;
use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;

use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categorys = Category::where('status','!=',0)
        ->orderBy('sort_order','ASC')
            ->select("id","name","slug","image","description","parent_id","status")
            ->get();
            foreach ($categorys as $category) {
                $category->image = url('images/category/' . $category->image); // Thêm URL đầy đủ cho ảnh
            }
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'categorys'=>$categorys
        ];
        return response()->json($result);
    }
    public function listid()
    {
        $categorys = Category::where('status','!=',0)
        ->orderBy('sort_order','ASC')
            ->select("id","name")
            ->get();

        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'categorys'=>$categorys
        ];
        return response()->json($result);
    }

    public function trash()
    {
        $categorys = Category::where('status','=',0)
            ->orderBy('sort_order','ASC')
            ->select("id","name","slug","image","description","parent_id","status")
            ->get();
            foreach ($categorys as $category) {
                $category->image = url('images/category/' . $category->image); // Thêm URL đầy đủ cho ảnh
            }
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'categorys'=>$categorys
        ];
        return response()->json($result);
    }
    public function trashdelete($id)
    {

        $category = Category::find($id);


        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy danh mục',
            ], 404);
        }


        $category->delete();


        $categorys = Category::where('status', '=', 0)
            ->orderBy('sort_order', 'ASC')
            ->select("id", "name", "slug", "image", "description", "parent_id", "status")
            ->get();

        // Thêm URL đầy đủ cho ảnh
        foreach ($categorys as $category) {
            $category->image = url('images/category/' . $category->image);
        }

        // Trả về kết quả
        $result = [
            'status' => true,
            'message' => 'Xóa và tải dữ liệu thành công',
            'categorys' => $categorys
        ];

        return response()->json($result);
    }

    public function show($id)
    {
        $category = Category::find($id);
        if($category==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'category'=>$category
            ];
        }
        else
        {
            $result =[
                'status'=>true,
                'message'=>'Tải dữ liệu thành công',
                'category'=>$category
            ];
        }
        return response()->json($result);
    }


    public function store(StoreCategoryRequest $request)
    {
        $category = new Category();
        $category->name =  $request->name;
        $category->slug =  $request->slug;
        $list_exten =['jpg','png','webp','gif'];
        if($request->image)
        {
           $exten=$request->image->extension();
            if(in_array($exten, $list_exten))
            {
                $imageName = date('YmdHis').".".$exten;
                $request->image->move(public_path('images/category'), $imageName);
                $category->image =  $imageName;
            }
        }
        $category->description =  $request->description;
        $category->sort_order =  $request->sort_order??1;
        $category->parent_id =  $request->parent_id ?? 0;

        $category->status =  1;
        $category->created_by =  1;
        $category->created_at =  date('Y-m-d H:i:s');
        if($category->save())
        {
            $result =[
                'status'=>true,
                'message'=>'Thêm thành công',
                'category'=>$category
            ];
        }
        else
        {
            $result =[
                'status'=>false,
                'message'=>'Thêm thất bại',
                'category'=>null
            ];
        }

        return response()->json($result);
    }


    // public function update(UpdateCategoryRequest $request, $id)
    // {
    //     $category = Category::find($id);
    //     if($category==null)
    //     {
    //         $result =[
    //             'status'=>false,
    //             'message'=>'Không tìm thấy dữ liệu',
    //             'category'=>$category
    //         ];
    //     }
    //     else
    //     {
    //         $category->name =  $request->name;
    //         $category->slug =  $request->slug;
    //         $list_exten =['jpg','png','webp','gif'];
    //         if($request->image)
    //         {
    //            $exten=$request->image->extension();
    //             if(in_array($exten, $list_exten))
    //             {
    //                 $imageName = date('YmdHis').".".$exten;
    //                 $request->image->move(public_path('images/category'), $imageName);
    //                 $category->image =  $imageName;
    //             }
    //         }
    //         $category->description =  $request->description;
    //         $category->sort_order =  $request->sort_order;
    //         $category->parent_id =  $request->parent_id;
    //         $category->status =  $request->status;
    //         $category->updated_by =  1;
    //         $category->updated_at = date('Y-m-d H:i:s');
    //         $category->save();
    //         $result =[
    //             'status'=>true,
    //             'message'=>'Sửa thành công',
    //             'category'=>$category
    //         ];
    //     }
    //     return response()->json($result);
    // }

    public function update(UpdateCategoryRequest $request, $id)
    {
        $category = Category::find($id);
        if ($category == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'category' => $category
            ];
        } else {
            // Cập nhật các trường khác
            $category->name = $request->name;
            $category->slug = $request->slug;

            // Kiểm tra và cập nhật hình ảnh nếu có
            $list_exten = ['jpg', 'png', 'webp', 'gif'];
            if ($request->hasFile('image')) {
                $exten = $request->image->extension();
                if (in_array($exten, $list_exten)) {
                    $imageName = date('YmdHis') . "." . $exten;
                    $request->image->move(public_path('images/category'), $imageName);
                    $category->image = $imageName; // Cập nhật hình ảnh
                }
            }

            // Cập nhật các trường còn lại
            $category->description = $request->description;
            $category->sort_order = $request->sort_order;
            $category->parent_id = $request->parent_id;
            $category->status = $request->status;
            $category->updated_by = 1;
            $category->updated_at = date('Y-m-d H:i:s');

            // Lưu lại các thay đổi
            $category->save();

            $result = [
                'status' => true,
                'message' => 'Sửa thành công',
                'category' => $category
            ];
        }

        return response()->json($result);
    }


    public function status($id)
    {
        $category = Category::where('status','=',$id)
        ->orderBy('sort_order','ASC')
        ->select("id","name","slug","image","description","parent_id","status")
        ->get();
        if ($category->isEmpty()) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'category' => null
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'category' => $category
            ];
        }

        return response()->json($result);
    }


    public function delete($id)
    {
        $category = Category::find($id);
        if($category==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'category'=>$category
            ];
        }
        else
        {
            $category->status = 0;
            $category->updated_by =  1;
            $category->updated_at =  date('Y-m-d H:i:s');
            $category->save();
            $result =[
                'status'=>true,
                'message'=>'Dữ liệu đưa vào thùng rác thành công',
                'category'=>$category
            ];
        }
        return response()->json($result);
    }


    public function restore($id)
    {
        $category = Category::find($id);
        if($category==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'category'=>$category
            ];
        } elseif($category->status!=0) {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'category'=>null
            ];
        }
        else
        {
            $category->status = 1;
            $category->updated_by =  1;
            $category->updated_at =  date('Y-m-d H:i:s');
            $category->save();
            $result =[
                'status'=>true,
                'message'=>'Khôi phục dữ liệu thành công',
                'category'=>$category
            ];
        }
        return response()->json($result);
    }





    public function updatePStatus(Request $request, $id)
    {
        $category = Category::find($id);


        if ($category == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'category' => null
            ]);
        }

        if (!in_array($request->status, [2, 1])) {
            return response()->json([
                'status' => false,
                'message' => 'Status chỉ nhận giá trị 1 hoặc 2',
                'category' => null
            ]);
        }

        $category->status = $request->status;


        if ($category->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Sửa thành công',
                'category' => $category
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Sửa thất bại',
                'category' => null
            ]);
        }
    }



}

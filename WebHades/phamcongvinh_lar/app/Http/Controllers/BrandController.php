<?php

namespace App\Http\Controllers;
use App\Models\Brand;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;

use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::where('status','!=',0)
            ->orderBy('sort_order','ASC')
            ->select("id","name","slug","image","description","status")
            ->get();
            foreach ($brands as $brand) {
                $brand->image = url('images/brand/' . $brand->image); // Thêm URL đầy đủ cho thumbnail
            }
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'brands'=>$brands
        ];
        return response()->json($result);
    }

    public function trash()
    {
        $brands = Brand::where('status','=',0)
            ->orderBy('sort_order','ASC')
            ->select("id","name","slug","image","description","status")
            ->get();
            foreach ($brands as $brand) {
                $brand->image = url('images/brand/' . $brand->image);
            }
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'brands'=>$brands
        ];
        return response()->json($result);
    }
    public function trashdelete($id)
    {

        $brands = Brand::find($id);


        if (!$brands) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy danh mục',
            ], 404);
        }


        $brands->delete();


        $brands = Brand::where('status', '=', 0)
            ->orderBy('sort_order', 'ASC')
            ->select("id", "name", "slug", "image", "description", "parent_id", "status")
            ->get();

        // Thêm URL đầy đủ cho ảnh
        foreach ($brands as $brand) {
            $brand->image = url('images/brand/' . $brand->image);
        }

        // Trả về kết quả
        $result = [
            'status' => true,
            'message' => 'Xóa và tải dữ liệu thành công',
            'brands' => $brands
        ];

        return response()->json($result);
    }

    public function show($id)
    {
        $brand = Brand::find($id);
        if($brand==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'brand'=>$brand
            ];
        }
        else
        {
            $result =[
                'status'=>true,
                'message'=>'Tải dữ liệu thành công',
                'brand'=>$brand
            ];
        }
        return response()->json($result);
    }


    public function store(StoreBrandRequest $request)
    {
        $brand = new Brand();
        $brand->name =  $request->name;
        $brand->slug =  $request->slug;
        $brand->description =  $request->description;
        $list_exten =['jpg','png','webp','gif'];
        if($request->image)
        {
           $exten=$request->image->extension();
            if(in_array($exten, $list_exten))
            {
                $imageName = date('YmdHis').".".$exten;
                $request->image->move(public_path('images/brand'), $imageName);
                $brand->image =  $imageName;
            }
        }
        $brand->sort_order =  $request->sort_order;
        $brand->status =  1;
        $brand->created_by =  1;
        $brand->created_at =  date('Y-m-d H:i:s');
        if($brand->save())
        {
            $result =[
                'status'=>true,
                'message'=>'Thêm thành công',
                'brand'=>$brand
            ];
        }
        else
        {
            $result =[
                'status'=>false,
                'message'=>'Thêm thất bại',
                'brand'=>null
            ];
        }

        return response()->json($result);
    }


    // public function update(UpdateBrandRequest $request, $id)
    // {
    //     $brand = Brand::find($id);
    //     if($brand==null)
    //     {
    //         $result =[
    //             'status'=>false,
    //             'message'=>'Không tìm thấy dữ liệu',
    //             'brand'=>$brand
    //         ];
    //     }
    //     else
    //     {
    //         $brand->name =  $request->name;
    //         $brand->slug =  $request->slug;
    //         $brand->description =  $request->description;
    //         $list_exten =['jpg','png','webp','gif'];
    //         if($request->image)
    //         {
    //            $exten=$request->image->extension();
    //             if(in_array($exten, $list_exten))
    //             {
    //                 $imageName = date('YmdHis').".".$exten;
    //                 $request->image->move(public_path('images/brand'), $imageName);
    //                 $brand->image =  $imageName;
    //             }
    //         }
    //         //$brand->sort_order =  $request->sort_order;
    //         //$brand->status =  $request->status;
    //         $brand->updated_by =  1;
    //         $brand->updated_at =  date('Y-m-d H:i:s');
    //         $brand->save();
    //         $result =[
    //             'status'=>true,
    //             'message'=>'Sửa thành công',
    //             'brand'=>$brand
    //         ];
    //     }
    //     return response()->json($result);
    // }
    public function update(UpdateBrandRequest $request, $id)
{
    $brand = Brand::find($id);
    if ($brand == null) {
        $result = [
            'status' => false,
            'message' => 'Không tìm thấy dữ liệu',
            'brand' => $brand
        ];
    } else {
        $brand->name = $request->name;
        $brand->slug = $request->slug;
        $brand->description = $request->description;

        $list_exten = ['jpg', 'png', 'webp', 'gif'];
        if ($request->hasFile('image')) {
            $exten = $request->image->extension();
            if (in_array($exten, $list_exten)) {
                $imageName = date('YmdHis') . "." . $exten;
                $request->image->move(public_path('images/brand'), $imageName);
                $brand->image = $imageName; // Cập nhật ảnh mới
            }
        }

        //$brand->sort_order =  $request->sort_order;
        //$brand->status =  $request->status;
        $brand->updated_by = 1;
        $brand->updated_at = date('Y-m-d H:i:s');
        $brand->save();

        $result = [
            'status' => true,
            'message' => 'Sửa thành công',
            'brand' => $brand
        ];
    }
    return response()->json($result);
}



    public function status($id)
    {
        $brand = Brand::where('status','=',$id)
        ->orderBy('sort_order','ASC')
        ->select("id","name","slug","image","description")
        ->get();
        if ($brand->isEmpty()) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'brand' => null
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'brand' => $brand
            ];
        }

        return response()->json($result);
    }


    public function delete($id)
    {
        $brand = Brand::find($id);
        if($brand==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'brand'=>$brand
            ];
        // } elseif($brand->status!=1) {
        //     $result =[
        //         'status'=>false,
        //         'message'=>'Không tìm thấy dữ liệu',
        //         'brand'=>null
        //     ];
        // }
        }
        else
        {
            $brand->status = 0;
            $brand->updated_by =  1;
            $brand->updated_at =  date('Y-m-d H:i:s');
            $brand->save();
            $result =[
                'status'=>true,
                'message'=>'Dữ liệu đưa vào thùng rác thành công',
                'brand'=>$brand
            ];
        }
        return response()->json($result);
    }


    public function restore($id)
    {
        $brand = Brand::find($id);
        if($brand==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'brand'=>$brand
            ];
        } elseif($brand->status!=0) {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'brand'=>null
            ];
        }
        else
        {
            $brand->status = 1;
            $brand->updated_by =  1;
            $brand->updated_at =  date('Y-m-d H:i:s');
            $brand->save();
            $result =[
                'status'=>true,
                'message'=>'Khôi phục dữ liệu thành công',
                'brand'=>$brand
            ];
        }
        return response()->json($result);
    }



    public function destroy($id)
    {
        $brand = Brand::find($id);
        if($brand==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'brand'=>$brand
            ];
        } elseif($brand->status!=1) {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'brand'=>null
            ];
        }
        else
        {
            $brand->status = 2;
            $brand->updated_by =  1;
            $brand->updated_at =  date('Y-m-d H:i:s');
            $brand->save();
            $result =[
                'status'=>true,
                'message'=>'Xóa dữ liệu thành công',
                'brand'=>$brand
            ];
        }
        return response()->json($result);
    }

    public function updatePStatus(Request $request, $id)
    {
        $brand = Brand::find($id);


        if ($brand == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'brand' => null
            ]);
        }

        if (!in_array($request->status, [2, 1])) {
            return response()->json([
                'status' => false,
                'message' => 'Status chỉ nhận giá trị 1 hoặc 2',
                'brand' => null
            ]);
        }

        $brand->status = $request->status;


        if ($brand->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Sửa thành công',
                'brand' => $brand
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Sửa thất bại',
                'brand' => null
            ]);
        }
    }




}

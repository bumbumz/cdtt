<?php

namespace App\Http\Controllers;
use App\Models\Banner;
use App\Http\Requests\StoreBannerRequest;
use App\Http\Requests\UpdateBannerRequest;

use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::where('status','!=',0)
            ->orderBy('sort_order','ASC')
            ->select("id","name","image","status","position")
            ->get();
            foreach ($banners as $banner) {
                $banner->image = url('images/banner/' . $banner->image); // Thêm URL đầy đủ cho ảnh
            }
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'banners'=>$banners
        ];
        return response()->json($result);
    }

    public function trash()
    {
        $banners = Banner::where('status','=',0)
            ->orderBy('sort_order','ASC')
            ->select("id","name","image","status","position")
            ->get();
            foreach ($banners as $banner) {
                $banner->image = url('images/banner/' . $banner->image);
            }
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'banners'=>$banners
        ];
        return response()->json($result);
    }

    public function show($id)
    {
        $banner = Banner::find($id);
        if($banner==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'banner'=>$banner
            ];
        }
        else
        {
            $result =[
                'status'=>true,
                'message'=>'Tải dữ liệu thành công',
                'banner'=>$banner
            ];
        }
        return response()->json($result);
    }


    public function store(StoreBannerRequest $request)
    {
        $banner = new Banner();
        $banner->name =  $request->name;
        $banner->link =  $request->link;
        $check_save = false;
        $list_exten =['jpg','png','webp','gif'];
        if($request->image)
        {
           $exten=$request->image->extension();
            if(in_array($exten, $list_exten))
            {
                $imageName = date('YmdHis').".".$exten;
                $request->image->move(public_path('images/banner'), $imageName);
                $banner->image =  $imageName;
                $check_save = true;
            }
        }
        $banner->description =  $request->description;
        $banner->position = $request->position ?? 'slideshow';
        $banner->sort_order =  $request->sort_order;
        $banner->created_by =  1;
        $banner->created_at =  date('Y-m-d H:i:s');
        $banner->status =  1;
        if($check_save == true)
        {
            if($banner->save())
            {
                $result =[
                    'status'=>true,
                    'message'=>'Thêm thành công',
                    'banner'=>$banner
                ];
            }
            else
            {
                $result =[
                    'status'=>false,
                    'message'=>'Không thể thêm',
                    'banner'=>null
                ];
            }

        }
        else
        {
            $result =[
                'status'=>false,
                'message'=>'Chưa chọn hình ảnh',
                'banner'=>null
            ];
        }
        return response()->json($result);
    }


    // public function update(UpdateBannerRequest $request, $id)
    // {
    //     $banner = Banner::find($id);
    //     if($banner==null)
    //     {
    //         $result =[
    //             'status'=>false,
    //             'message'=>'Không tìm thấy dữ liệu',
    //             'banner'=>$banner
    //         ];
    //     }
    //     else
    //     {
    //         $banner->name =  $request->name;
    //         $banner->link =  $request->link;
    //         $check_save = false;
    //         $list_exten =['jpg','png','webp','gif'];
    //         if($request->image)
    //         {
    //         $exten=$request->image->extension();
    //             if(in_array($exten, $list_exten))
    //             {
    //                 $imageName = date('YmdHis').".".$exten;
    //                 $request->image->move(public_path('images/banner'), $imageName);
    //                 $banner->image =  $imageName;
    //                 $check_save = true;


    //             }
    //         }
    //         $banner->description =  $request->description;
    //         $banner->position = $request->position;
    //         $banner->sort_order =  $request->sort_order;
    //         $banner->updated_by =  1;
    //         $banner->updated_at =  date('Y-m-d H:i:s');
    //         //$banner->status =  $request->status;
    //         $banner->save();
    //         if($check_save == true)
    //         {
    //             if($banner->save())
    //             {
    //                 $result =[
    //                     'status'=>true,
    //                     'message'=>'Sửa thành công',
    //                     'banner'=>$banner
    //                 ];
    //             }
    //             else
    //             {
    //                 $result =[
    //                     'status'=>false,
    //                     'message'=>'Sửa thất bại',
    //                     'banner'=>null
    //                 ];
    //             }
    //         }
    //     }
    //     return response()->json($result);
    // }
    public function update(UpdateBannerRequest $request, $id)
    {
        $banner = Banner::find($id);
        if ($banner == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'banner' => $banner
            ];
        } else {
            $banner->name = $request->name;
            $banner->link = $request->link;

            $list_exten = ['jpg', 'png', 'webp', 'gif'];
            $check_save = false;
            // Kiểm tra nếu có ảnh được tải lên
            if ($request->hasFile('image')) {
                $exten = $request->image->extension();
                if (in_array($exten, $list_exten)) {
                    $imageName = date('YmdHis') . "." . $exten;
                    $request->image->move(public_path('images/banner'), $imageName);
                    $banner->image = $imageName;
                    $check_save = true; // Đánh dấu đã cập nhật ảnh
                }
            }
            // Cập nhật các trường khác
            $banner->description = $request->description;
            $banner->position = $request->position;
            $banner->sort_order = $request->sort_order;
            $banner->updated_by = 1;
            $banner->updated_at = date('Y-m-d H:i:s');
            // Lưu dữ liệu
            if ($banner->save()) {
                $result = [
                    'status' => true,
                    'message' => 'Sửa thành công',
                    'banner' => $banner
                ];
            } else {
                $result = [
                    'status' => false,
                    'message' => 'Sửa thất bại',
                    'banner' => null
                ];
            }
        }

        return response()->json($result);
    }
    public function status($id)
    {
        $banner = Banner::where('status','=',$id)
        ->orderBy('sort_order','ASC')
        ->select("id","name","image","status","position")
        ->get();
        if ($banner->isEmpty()) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'banner' => null
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'banner' => $banner
            ];
        }

        return response()->json($result);
    }


    public function delete($id)
    {
        $banner = Banner::find($id);
        if($banner==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'banner'=>$banner
            ];
        // } elseif($banner->status!=1) {
        //     $result =[
        //         'status'=>false,
        //         'message'=>'Không tìm thấy dữ liệu',
        //         'banner'=>null
        //     ];
        // }
        }
        else
        {
            $banner->status = 0;
            $banner->updated_by =  1;
            $banner->updated_at =  date('Y-m-d H:i:s');
            $banner->save();
            $result =[
                'status'=>true,
                'message'=>'Dữ liệu đưa vào thùng rác thành công',
                'banner'=>$banner
            ];
        }
        return response()->json($result);
    }


    public function restore($id)
    {
        $banner = Banner::find($id);
        if($banner==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'banner'=>$banner
            ];
        } elseif($banner->status!=0) {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'banner'=>null
            ];
        }
        else
        {
            $banner->status = 1;
            $banner->updated_by =  1;
            $banner->updated_at =  date('Y-m-d H:i:s');
            $banner->save();
            $result =[
                'status'=>true,
                'message'=>'Khôi phục dữ liệu thành công',
                'banner'=>$banner
            ];
        }
        return response()->json($result);
    }



    public function destroy($id)
    {
        $banner = Banner::find($id);
        if($banner==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'banner'=>$banner
            ];
        // } elseif($banner->status!=1) {
        //     $result =[
        //         'status'=>false,
        //         'message'=>'Không tìm thấy dữ liệu',
        //         'banner'=>null
        //     ];
        }
        else
        {
            $imagePath = public_path('images/banner/' . $banner->image);
            if (file_exists($imagePath) && !empty($banner->image)) {
                unlink($imagePath);
            }
            $banner->delete();
            $banner->status = 2;
            $banner->updated_by =  1;
            $banner->updated_at =  date('Y-m-d H:i:s');
            $banner->save();
            $result =[
                'status'=>true,
                'message'=>'Xóa dữ liệu thành công',
                'banner'=>$banner
            ];
        }
        return response()->json($result);
    }
    public function updatePStatus(Request $request, $id)
    {
        $banner = Banner::find($id);


        if ($banner == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'banner' => null
            ]);
        }

        if (!in_array($request->status, [2, 1])) {
            return response()->json([
                'status' => false,
                'message' => 'Status chỉ nhận giá trị 1 hoặc 2',
                'banner' => null
            ]);
        }

        $banner->status = $request->status;


        if ($banner->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Sửa thành công',
                'banner' => $banner
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Sửa thất bại',
                'banner' => null
            ]);
        }
    }
    public function trashdelete($id)
    {

        $banners = Banner::find($id);


        if (!$banners) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy danh mục',
            ], 404);
        }


        $banners->delete();


        $banners = Banner::where('status', '=', 0)
            ->orderBy('sort_order', 'ASC')
            ->select("id", "name",  "image","status","position")
            ->get();

        // Thêm URL đầy đủ cho ảnh
        foreach ($banners as $brand) {
            $brand->image = url('images/brand/' . $brand->image);
        }

        // Trả về kết quả
        $result = [
            'status' => true,
            'message' => 'Xóa và tải dữ liệu thành công',
            'banners' => $banners
        ];

        return response()->json($result);
    }





}

<?php

namespace App\Http\Controllers;
use App\Models\Topic;
use App\Http\Requests\StoreTopicRequest;
use App\Http\Requests\UpdateTopicRequest;

use Illuminate\Http\Request;

class TopicController extends Controller
{
    public function index()
    {
        $topics = Topic::where('status','!=',0)
            ->orderBy('sort_order','ASC')
            ->select("id","name","slug","description","status")
            ->get();
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'topics'=>$topics
        ];
        return response()->json($result);
    }

    public function trash()
    {
        $topics = Topic::where('status','=',0)
            ->orderBy('sort_order','ASC')
            ->select("id","name","slug","description","status")
            ->get();
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'topics'=>$topics
        ];
        return response()->json($result);
    }

    public function show($id)
    {
        $topic = Topic::find($id);
        if($topic==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'topic'=>$topic
            ];
        }
        else
        {
            $result =[
                'status'=>true,
                'message'=>'Tải dữ liệu thành công',
                'topic'=>$topic
            ];
        }
        return response()->json($result);
    }


    public function store(StoreTopicRequest $request)
    {
        $topic = new Topic();
        $topic->name =  $request->name;
        $topic->slug =  $request->slug;
        $topic->description =  $request->description;
        $topic->sort_order =  $request->sort_order;
        $topic->status =  1;
        $topic->created_by =  1;
        $topic->created_at = date('Y-m-d H:i:s');
        if($topic->save())
        {
            $result =[
                'status'=>true,
                'message'=>'Thêm thành công',
                'topic'=>$topic
            ];
        }
        else
        {
            $result =[
                'status'=>false,
                'message'=>'Thêm thất bại',
                'topic'=>null
            ];
        }

        return response()->json($result);
    }


    public function update(UpdateTopicRequest $request, $id)
    {
        $topic = Topic::find($id);
        if($topic==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'topic'=>$topic
            ];
        }
        else
        {
            $topic->name =  $request->name;
            $topic->slug =  $request->slug;
            $topic->description =  $request->description;
            $topic->sort_order =  $request->sort_order;
            $topic->status =  $request->status;
            $topic->updated_by =  1;
            $topic->updated_at = date('Y-m-d H:i:s');
            $topic->save();
            $result =[
                'status'=>true,
                'message'=>'Sửa thành công',
                'topic'=>$topic
            ];
        }
        return response()->json($result);
    }


    public function status($id)
    {
        $topic = Topic::where('status','=',$id)
        ->orderBy('sort_order','ASC')
        ->select("id","name","slug","description","status")
        ->get();
        if ($topic->isEmpty()) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'topic' => null
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'topic' => $topic
            ];
        }
        return response()->json($result);
    }


    public function delete($id)
    {
        $topic = Topic::find($id);
        if($topic==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'topic'=>$topic
            ];
        } elseif($topic->status!=1) {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'topic'=>null
            ];
        }
        else
        {
            $topic->status = 0;
            $topic->updated_by =  1;
            $topic->updated_at =  date('Y-m-d H:i:s');
            $topic->save();
            $result =[
                'status'=>true,
                'message'=>'Dữ liệu đưa vào thùng rác thành công',
                'topic'=>$topic
            ];
        }
        return response()->json($result);
    }


    public function restore($id)
    {
        $topic = Topic::find($id);
        if($topic==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'topic'=>$topic
            ];
        } elseif($topic->status!=0) {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'topic'=>null
            ];
        }
        else
        {
            $topic->status = 1;
            $topic->updated_by =  1;
            $topic->updated_at =  date('Y-m-d H:i:s');
            $topic->save();
            $result =[
                'status'=>true,
                'message'=>'Khôi phục dữ liệu thành công',
                'topic'=>$topic
            ];
        }
        return response()->json($result);
    }



    public function destroy($id)
    {
        $topic = Topic::find($id);
        if($topic==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'topic'=>$topic
            ];
        } elseif($topic->status!=1) {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'topic'=>null
            ];
        }
        else
        {
            $topic->status = 2;
            $topic->updated_by =  1;
            $topic->updated_at =  date('Y-m-d H:i:s');
            $topic->save();
            $result =[
                'status'=>true,
                'message'=>'Xóa dữ liệu thành công',
                'topic'=>$topic
            ];
        }
        return response()->json($result);
    }




}

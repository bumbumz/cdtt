<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Config;
use App\Http\Requests\UpdateConfigRequest;
class ConfigController extends Controller
{
    public function index()
    {
        $config = Config::where('status','!=',0)
            ->select("id","site_name","email","phones","address","hotline","zalo","facebook","status")
            ->get();
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'config'=>$config
        ];
        return response()->json($result);
    }

    public function show($id)
    {
        $config = Config::find($id);
        if($config==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'config'=>$config
            ];
        }
        else
        {
            $result =[
                'status'=>true,
                'message'=>'Tải dữ liệu thành công',
                'config'=>$config
            ];
        }
        return response()->json($result);
    }
    public function update(UpdateConfigRequest $request, $id)
    {
        $config = Config::find($id);
        if ($config == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'config' => $config
            ];
        } else {
            $config->site_name = $request->site_name;
            $config->email = $request->email;
            $config->phones = $request->phones;
            $config->address = $request->address;
            $config->hotline = $request->hotline;
            $config->zalo = $request->zalo;
            $config->facebook = $request->facebook;
            if ($config->save()) {
                $result = [
                    'status' => true,
                    'message' => 'Sửa thành công',
                    'config' => $config
                ];
            } else {
                $result = [
                    'status' => false,
                    'message' => 'Sửa thất bại',
                    'config' => null
                ];
            }
        }

        return response()->json($result);
    }


}

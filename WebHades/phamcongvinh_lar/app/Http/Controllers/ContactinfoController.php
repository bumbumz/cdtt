<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contactinfo;

class ContactinfoController extends Controller
{
    public function index()
    {
        $contactinfo = Contactinfo::select("id", "label", "value")->get();

        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'contactinfo' => $contactinfo
        ];

        return response()->json($result);
    }

    // Get contact info by ID
    public function show($id)
    {
        $contactinfo = Contactinfo::find($id);

        if ($contactinfo) {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'contactinfo' => $contactinfo
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'contactinfo' => null
            ];
        }

        return response()->json($result);
    }

    // Update contact info by ID
    public function update(Request $request, $id)
    {
        $contactinfo = Contactinfo::find($id);

        if ($contactinfo) {
            $contactinfo->label = $request->input('label');
            $contactinfo->value = $request->input('value');

            if ($contactinfo->save()) {
                $result = [
                    'status' => true,
                    'message' => 'Cập nhật thành công',
                    'contactinfo' => $contactinfo
                ];
            } else {
                $result = [
                    'status' => false,
                    'message' => 'Không thể cập nhật',
                    'contactinfo' => null
                ];
            }
        } else {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'contactinfo' => null
            ];
        }

        return response()->json($result);
    }
}

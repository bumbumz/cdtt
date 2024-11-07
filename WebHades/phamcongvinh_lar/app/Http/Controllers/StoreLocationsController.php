<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StoreLocations;


class StoreLocationsController extends Controller
{
    public function index()
    {
        $storelocations = StoreLocations::select("id", "text")->get();

        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'storelocations' => $storelocations
        ];

        return response()->json($result);
    }

    public function update(Request $request, $id)
    {
        $storeLocation = StoreLocations::find($id);

        if (!$storeLocation) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy địa điểm'
            ], 404);
        }

        $request->validate([
            'text' => 'required|string|max:255',
        ]);

        $storeLocation->text = $request->input('text');
        $storeLocation->save();

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật thành công',
            'storelocation' => $storeLocation
        ]);
    }

    public function show($id)
{
    $storeLocation = StoreLocations::find($id);

    if (!$storeLocation) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy địa điểm'
        ], 404);
    }

    return response()->json([
        'status' => true,
        'message' => 'Tải dữ liệu thành công',
        'storelocation' => $storeLocation
    ]);
}


}

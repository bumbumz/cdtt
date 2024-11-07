<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    public function index()
    {
        $contact = Contact::where('status','!=',0)
            ->select("id","name","email","phone","title","content","replay_id")
            ->get();
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'contact'=>$contact
        ];
        return response()->json($result);
    }
    public function trash()
    {
        $contact = Contact::where('status','=',0)
            ->select("id","name","email","phone","title","content","replay_id")
            ->get();
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'contact'=>$contact
        ];
        return response()->json($result);
    }

    public function show($id)
    {
        $contact = Contact::find($id);
        if($contact==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'contact'=>$contact
            ];
        }
        else
        {
            $result =[
                'status'=>true,
                'message'=>'Tải dữ liệu thành công',
                'contact'=>$contact
            ];
        }
        return response()->json($result);
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $contact = Contact::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'phone' => $validatedData['phone'],
            'title' => $validatedData['title'],
            'content' => $validatedData['content'],
            'status' => 1,
            'created_by' => 1,
            'updated_by' => 1,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $result = [
            'status' => true,
            'message' => 'Tạo liên hệ thành công',
            'contact' => $contact
        ];

        return response()->json($result, 201);
    }



}

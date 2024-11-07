<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AthurController extends Controller
{
    // Đăng ký user
    public function register(Request $request) {
        $validator = Validator::make($request->json()->all(), [
            'name' => 'required|string|max:1000',
            'email' => 'required|string|email|max:100|unique:users',
            'phone' => 'nullable|string|max:13',
            'address' => 'nullable|string|max:1000',
            'gender' => 'nullable|string|max:10',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'roles' => 'nullable|in:customer,admin',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->json()->get('name'),
            'email' => $request->json()->get('email'),
            'phone' => $request->json()->get('phone'),
            'address' => $request->json()->get('address'),
            'gender' => $request->json()->get('gender'),
            'thumbnail' => $request->json()->get('thumbnail'),
            'roles' => $request->json()->get('roles', 'customer'), 
            'username' => $request->json()->get('username'),
            'password' => Hash::make($request->json()->get('password')),
            'status' => 1,
        ]);

        // Tạo JWT token
        $token = JWTAuth::fromUser($user);
        return response()->json(compact('user', 'token'), 201);
    }

    // Đăng nhập user
    public function login(Request $request) {
        $credentials = $request->only('username', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }

        $user = auth()->user();
        return response()->json(compact( 'user','token'));
    }

    // Lấy thông tin user đang đăng nhập
    public function getAuthenticatedUser() {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }

        return response()->json(compact('user'));
    }
}

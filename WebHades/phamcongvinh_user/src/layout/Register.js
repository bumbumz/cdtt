import React, { useState } from 'react';
import { UserService } from '../Api';

const Register = () => {
    const [name, setName] = useState(''); // Thêm state cho tên
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState(''); // Thêm state cho số điện thoại
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }

        const userData = {
            name, // Thêm tên vào userData
            username,
            email,
            phone, // Thêm số điện thoại vào userData
            password,
            password_confirmation: confirmPassword // Thêm trường xác nhận mật khẩu
        };

        try {
            const response = await UserService.register(userData); // Sử dụng UserService.register
            console.log('Đăng ký thành công:', response);
            window.location.href = '/login'; // Chuyển hướng tới trang đăng nhập sau khi đăng ký thành công
        } catch (error) {
            console.error('Lỗi khi đăng ký:', error);
            alert(error.message); // Hiển thị thông báo lỗi
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-white">
            <div className="bg-white p-8 rounded-lg w-96">
                <h2 className="text-3xl font-bold text-center mb-6">ĐĂNG KÝ</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="name">Tên*</label>
                        <input
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            type="text"
                            id="name"
                            placeholder="Nhập tên của bạn"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="username">Tên đăng nhập*</label>
                        <input
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            type="text"
                            id="username"
                            placeholder="Nhập tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="email">Email*</label>
                        <input
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            type="email"
                            id="email"
                            placeholder="Nhập địa chỉ email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="phone">Số điện thoại*</label>
                        <input
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            type="tel"
                            id="phone"
                            placeholder="Nhập số điện thoại"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="password">Mật khẩu*</label>
                        <input
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="confirmPassword">Xác nhận mật khẩu*</label>
                        <input
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            type="password"
                            id="confirmPassword"
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
                        type="submit"
                    >
                        ĐĂNG KÝ
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <a className="text-gray-600 hover:underline" href="#">Quên mật khẩu?</a>
                    <span className="mx-1">hoặc</span>
                    <a className="text-gray-600 hover:underline" href="/login">Đăng nhập</a>
                </div>
            </div>
        </div>
    );
};

export default Register;

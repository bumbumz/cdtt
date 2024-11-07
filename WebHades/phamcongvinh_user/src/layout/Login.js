import React, { useState } from 'react';
import { login } from '../Api';
import { Link } from 'react-router-dom';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await login(username, password);
            const token = response.token;
            const user = response.user.id;
            localStorage.setItem('authToken', token);
            localStorage.setItem('userId', user);
            window.location.href = '/'; // Chuyển hướng sau khi đăng nhập thành công
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-white">
            <div className="bg-white p-8 rounded-lg  w-96">
                <h2 className="text-3xl font-bold text-center mb-6">ĐĂNG NHẬP</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="username">Username*</label>
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
                        <label className="block text-gray-700" htmlFor="password">Password*</label>
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
                    <button
                        className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
                        type="submit"
                    >
                        ĐĂNG NHẬP
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <a className="text-gray-600 hover:underline" href="#">Quên mật khẩu?</a>
                    <span className="mx-1">hoặc</span>

                    <Link

                        to="/register"

                        className="group border-2 p-2 relative block"
                    > <a className="text-gray-600 hover:underline" href="#"> Đăng ký</a>

                    </Link>

                </div>
            </div>
        </div>
    );
};

export default Login;

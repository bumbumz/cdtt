import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Add error state

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                username,
                password,
            });

            const { token, user } = response.data;

            // Check if the user role is "admin"
            if (user.roles === "admin") {
                localStorage.setItem('authToken', token);
                localStorage.setItem('userId', user.id);
                window.location.href = '/';
            } else {
                setError('Only admins are allowed to log in.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                        Login
                    </button>
                    {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                </form>
                <div className="mt-4 text-center">
                    <a href="/forgot-password" className="text-blue-500 hover:underline">
                        Quên mật khẩu?
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;

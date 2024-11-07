import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ResetPassword() {
    const { userId } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    console.log("id của user sửa mk là", userId)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Mật khẩu không khớp!');
            setIsError(true);
            return;
        }

        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/user/update-password/${userId}`, {
                password,
            });

            if (response.data.success) {

                setMessage('Mật khẩu đã được đặt lại thành công!');
                setIsError(false);

                navigate('/login');

            } else {
                setMessage(response.data.message || 'Đã xảy ra lỗi!');
                setIsError(true);
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
            setIsError(true);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Đặt Lại Mật Khẩu</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="password">Mật Khẩu Mới:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="confirmPassword">Nhập Lại Mật Khẩu:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                        Đặt Lại Mật Khẩu
                    </button>
                </form>
                {message && (
                    <div className={`mt-4 text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState(''); 
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/find-by-email-phone', {
                email,
                phone,
            });

            //console.log('Email sent:', response.data);

            if (response.data.status) {
                // Sử dụng id người dùng trả về trực tiếp ở đây  
                //console.log('Chuyển trang với ID người dùng:', response.data.user_id);
                navigate(`/reset-password/${response.data.user_id}`); setIsError(false);
                // Chuyển hướng người dùng ở đây nếu muốn  
            } else {
                setMessage('Không tìm thấy người dùng với thông tin đã cung cấp.');
                setIsError(true);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
            setIsError(true);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Quên Mật Khẩu</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="phone">Số điện thoại:</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                        Gửi
                    </button>
                </form>
                {/* Hiển thị thông báo */}
                {message && (
                    <div className={`mt-4 text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
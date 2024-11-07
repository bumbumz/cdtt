import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        thumbnail: null,
        roles: 'customer', // Mặc định vai trò là customer
    });

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate(); // Khởi tạo navigate

    // Hàm lấy thông tin người dùng  
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/user/show/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(response.data.user[0]);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'thumbnail') {
            setUserData((prevData) => ({
                ...prevData,
                thumbnail: files[0],
            }));
        } else {
            setUserData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('username', userData.username);
        formData.append('email', userData.email);
        formData.append('phone', userData.phone);
        formData.append('address', userData.address);
        formData.append('gender', userData.gender);
        formData.append('roles', userData.roles);
        if (userData.thumbnail) {
            formData.append('thumbnail', userData.thumbnail);
        }

        try {
            await axios.post(`http://127.0.0.1:8000/api/user/update/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Cập nhật thông tin cá nhân thành công!');
            navigate('/Home'); // Chuyển hướng về trang /Home
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Cập nhật không thành công! Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="bg-white shadow-md rounded-lg p-8 w-96">
                <h2 className="text-3xl font-bold text-center mb-6">Chỉnh sửa thông tin cá nhân</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="username">Tên người dùng</label>
                        <input
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                            type="text"
                            name="username"
                            id="username"
                            value={userData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="email">Email</label>
                        <input
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                            type="email"
                            name="email"
                            id="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="phone">Số điện thoại</label>
                        <input
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                            type="tel"
                            name="phone"
                            id="phone"
                            value={userData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="address">Địa chỉ</label>
                        <input
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                            type="text"
                            name="address"
                            id="address"
                            value={userData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="gender">Giới tính</label>
                        <select
                            name="gender"
                            id="gender"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                            value={userData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="thumbnail">Ảnh đại diện</label>
                        <input
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                            type="file"
                            name="thumbnail"
                            id="thumbnail"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition ease-in duration-200"
                        type="submit"
                    >
                        Cập nhật
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { UserService } from '../../../Api';

export default function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    console.log("usserid", id)
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        thumbnail: null, // Đổi thành null để có thể gán file
        roles: '',
        username: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await UserService.getId(id);
                console.log("response", response.user)
                const dataUser = response.user[0];
                if (dataUser) {
                    setUser({
                        name: dataUser.name || '',
                        email: dataUser.email || '',
                        phone: dataUser.phone || '',
                        address: dataUser.address || '',
                        gender: dataUser.gender || '',
                        thumbnail: dataUser.thumbnail || null,
                        roles: dataUser.roles || '',
                        username: dataUser.username || '',
                    });
                } else {
                    throw new Error('User not found');
                }
            } catch (err) {
                console.error("Error fetching user:", err);
                setError('Failed to load user details.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);
    console.log("edit user:", user)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('phone', user.phone);
        formData.append('address', user.address);
        formData.append('gender', user.gender);
        formData.append('roles', user.roles);
        formData.append('username', user.username);

        if (user.thumbnail) {
            formData.append('thumbnail', user.thumbnail); // Gửi file thumbnail lên backend
        }

        try {
            await UserService.update(id, formData); // Gửi FormData lên backend
            navigate('/admin/user'); // Chuyển hướng đến danh sách người dùng
        } catch (err) {
            console.error("Error updating user:", err.response ? err.response.data : err.message);
            setError('Failed to update user.');
        }
    };

    const handleFileChange = (e) => {
        setUser(prevState => ({
            ...prevState,
            thumbnail: e.target.files[0] // Cập nhật file hình ảnh khi được chọn
        }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-semibold mb-6 text-white">Chỉnh Sửa Người Dùng</h1>
            <form onSubmit={handleUpdateUser} className="mb-6 flex flex-col space-y-4">
                <p className='text-white'>Tên</p>
                <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Tên người dùng"
                    required
                />

                <p className='text-white'>Email</p>
                <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Email"
                    required
                />

                <p className='text-white'>Điện thoại</p>
                <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Số điện thoại"
                    required
                />

                <p className='text-white'>Địa chỉ</p>
                <input
                    type="text"
                    name="address"
                    value={user.address}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Địa chỉ"
                    required
                />

                <p className='text-white'>Giới tính</p>
                <select
                    name="gender"
                    value={user.gender}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    required
                >
                    <option value="">Chọn giới tính</option>
                    <option value="nam">Nam</option>
                    <option value="nữ">Nữ</option>
                </select>

                <p className='text-white'>Hình ảnh</p>
                <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border px-4 py-2 rounded-lg"
                />

                <p className='text-white'>Vai trò</p>

                <select
                    name="roles"
                    value={user.roles}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    required
                >
                    <option value="">Chọn chức vụ</option>
                    <option value="customer">Khách hàng</option>
                    <option value="admin">Quản trị viên</option>
                </select>


                <p className='text-white'>Tên người dùng</p>
                <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Tên người dùng"
                />

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                    <FaEdit className="mr-2" /> Cập Nhật
                </button>
            </form>
        </div>
    );
}

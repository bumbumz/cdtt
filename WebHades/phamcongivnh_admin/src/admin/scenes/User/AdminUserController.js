import React, { useEffect, useState } from 'react';
import { UserService } from '../../../Api';
import Switch from "react-switch";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { BsTrash2 } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
function AdminUserController() {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await UserService.getList();
                console.log("user", response.user)
                if (response && response.user) {
                    setUser(response.user); // Lưu danh sách banner
                } else {
                    console.error("Unexpected response format:", response);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching banners:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <div>Loading banners...</div>;
    if (error) return <div>Error loading banners!</div>;
    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 2 : 1; // Chuyển đổi giữa 1 và 0
        console.log(`Updating status for product ID: ${id}, New Status: ${newStatus}`);

        try {
            await UserService.editstatus(id, { status: newStatus }); // Gọi API để cập nhật trạng thái
            setUser(user.map(users =>
                users.id === id ? { ...users, status: newStatus } : users
            ));
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };
    const handleDeleteuser = async (id) => {
        if (window.confirm("Are you sure you want to delete this brand?")) {
            try {
                await UserService.delete(id);
                // Remove the deleted brand from the state
                setUser(user.filter(user => user.id !== id));
            } catch (err) {
                console.error("Error deleting brand:", err);
                setError(err);
            }
        }
    };
    return (
        <div className="p-4 space-x-2">
            <h1 className="text-2xl font-semibold mb-6 text-white">Quản lý User</h1>
            
            <Link
                to="/admin/user/trash"
                className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
            >
                <BsTrash2 />
            </Link>

            <table className="min-w-full border-collapse border border-gray-400">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="border border-gray-400 p-2">ID</th>
                        <th className="border border-gray-400 p-2">Tên User</th>
                        <th className="border border-gray-400 p-2">Email</th>
                        <th className="border border-gray-400 p-2">Số điện thoại</th>
                        <th className="border border-gray-400 p-2">Địa chỉ</th>
                        <th className="border border-gray-400 p-2">Giới tính</th>
                        <th className="border border-gray-400 p-2">Hình Ảnh</th>
                        <th className="border border-gray-400 p-2">Chức vụ</th>
                        <th className="border border-gray-400 p-2">Tên người dùng</th>
                        <th className="border border-gray-400 p-2">Trạng thái</th>
                        <th className="border border-gray-400 p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {user.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-700 text-white">
                            <td className="border border-gray-400 p-2">{user.id}</td>
                            <td className="border border-gray-400 p-2">{user.name}</td>
                            <td className="border border-gray-400 p-2">{user.email}</td>
                            <td className="border border-gray-400 p-2">{user.phone}</td>
                            <td className="border border-gray-400 p-2">{user.address}</td>
                            <td className="border border-gray-400 p-2">{user.gender}</td>

                            <td className="border border-gray-400 p-2">
                                <img
                                    src={user.thumbnail}
                                    alt={user.name}
                                    className="w-24 h-auto"
                                />
                            </td>
                            <td className="border border-gray-400 p-2">{user.roles}</td>
                            <td className="border border-gray-400 p-2">{user.username}</td>
                            <td className="border border-gray-400 p-2">
                                <Switch
                                    onChange={() => handleStatusChange(user.id, user.status)}
                                    checked={user.status === 1}
                                    onColor="#4CAF50" // Màu khi bật
                                    offColor="#FF4136" // Màu khi tắt
                                />
                            </td>

                            <td className="border-t border-gray-400 p-2 flex space-x-2  items-start justify-center ">
                                <Link
                                    to={`/admin/user/edit/${user.id}`}
                                    className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition inline-flex items-center"
                                >
                                    <FaEdit />
                                </Link>
                                <button
                                    onClick={() => handleDeleteuser(user.id)}
                                    className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition inline-flex items-center"
                                >
                                    <RiDeleteBin5Line />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminUserController;

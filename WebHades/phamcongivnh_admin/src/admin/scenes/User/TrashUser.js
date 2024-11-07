import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { BsTrash2 } from "react-icons/bs";
import { UserService } from '../../../Api'; // Đảm bảo nhập đúng
import Switch from "react-switch";
export default function TrashUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await UserService.getTrash();
                if (Array.isArray(response.user)) {
                    setUsers(response.user); // Nếu là mảng, set trực tiếp
                } else {
                    setUsers([response.user]); // Nếu là đối tượng, chuyển nó thành mảng
                }
            } catch (err) {
                console.error("Error fetching User:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <div>Loading User...</div>;
    if (error) return <div>Error loading User!</div>;
    console.log("user:", users)

    // Handle form submission to add a new category


    // Handle delete category
    const handleDeleteUser = async (id) => {
        console.log("id", id)
        if (window.confirm("Are you sure you want to delete this User?")) {
            try {
                await UserService.trashdelete(id)
                setUsers(users.filter(user => user.id !== id));
            } catch (err) {
                console.error("Error deleting User:", err);
                setError(err);
            }
        };
    }
    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 2 : 1; // Chuyển đổi giữa 1 và 0
        console.log(`Updating status for product ID: ${id}, New Status: ${newStatus}`);

        try {
            await UserService.editstatus(id, { status: newStatus }); // Gọi API để cập nhật trạng thái
            setUsers(users.map(user =>
                user.id === id ? { ...user, status: newStatus } : user
            ));
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    return (
        <div className="p-4 space-x-2">
            <h1 className="text-2xl font-semibold mb-6 text-white ">Quản lý Giỏ Rác User</h1>

            {/* Button to navigate to AddUser form */}
            <Link
                to="/admin/user"
                className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
            >
                <IoIosArrowBack />
            </Link>


            {/* Display list of categories */}
            {users.length === 0 ? (
                <div className="text-white">Không có danh mục nào.</div>
            ) : (
                <table className="min-w-full border-collapse border border-gray-400">
                    <thead className="bg-gray-800 text-white">
                        <tr>
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
                        {users.map(user => (
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
                                <td className="border-t border-gray-400 p-2 flex space-x-2 justify-center items-center">
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition inline-flex items-center"
                                    >
                                        <RiDeleteBin5Line />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { BsTrash2 } from "react-icons/bs";
import { CategoryService } from '../../../Api'; // Đảm bảo nhập đúng
import Switch from "react-switch";
export default function TrashCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await CategoryService.getTrash();
                setCategories(response.categorys);
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, []);

    if (loading) return <div>Loading categories...</div>;
    if (error) return <div>Error loading categories!</div>;
    console.log("cate:", categories)

    // Handle form submission to add a new category


    // Handle delete category
    const handleDeleteCategory = async (id) => {
        console.log("id", id)
        if (window.confirm("Are you sure you want to delete this brand?")) {
            try {
                await CategoryService.trashdelete(id)

                setCategories(categories.filter(category => category.id !== id));
            } catch (err) {
                console.error("Error deleting brand:", err);
                setError(err);
            }
        };
    }
    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 2 : 1; // Chuyển đổi giữa 1 và 0
        console.log(`Updating status for product ID: ${id}, New Status: ${newStatus}`);

        try {
            await CategoryService.editstatus(id, { status: newStatus }); // Gọi API để cập nhật trạng thái
            setCategories(categories.map(categorie =>
                categorie.id === id ? { ...categorie, status: newStatus } : categorie
            ));
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    return (
        <div className="p-4 space-x-2">
            <h1 className="text-2xl font-semibold mb-6 text-white ">Quản lý Giỏ Rác Category</h1>

            {/* Button to navigate to AddCategory form */}
            <Link
                to="/admin/category"
                className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
            >
                <IoIosArrowBack />
            </Link>
            <Link
                to="/admin/category/trash"
                className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
            >
                <BsTrash2 />
            </Link>

            {/* Display list of categories */}
            {categories.length === 0 ? (
                <div className="text-white">Không có danh mục nào.</div>
            ) : (
                <table className="min-w-full border-collapse border border-gray-400">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="border border-gray-400 p-2">#</th>
                            <th className="border border-gray-400 p-2">Danh mục</th>
                            <th className="border border-gray-400 p-2">Hình Ảnh</th>
                            <th className="border border-gray-400 p-2">Chi tiết</th>
                            <th className="border border-gray-400 p-2">Hành động</th>
                            <th className="border border-gray-400 p-2">Trạng thái</th>
                            <th className="border border-gray-400 p-2">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id} className="hover:bg-gray-700 text-white">
                                <td className="border border-gray-400 p-2">{category.id}</td>
                                <td className="border border-gray-400 p-2">{category.name}</td>
                                <td className="border border-gray-400 p-2">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-24 h-auto"
                                    />
                                </td>
                                <td className="border border-gray-400 p-2">{category.description}</td>
                                <td className="border border-gray-400 p-2">{category.parent_id}</td>
                                <td className="border border-gray-400 p-2">
                                    <Switch
                                        onChange={() => handleStatusChange(category.id, category.status)}
                                        checked={category.status === 1}
                                        onColor="#4CAF50" // Màu khi bật
                                        offColor="#FF4136" // Màu khi tắt
                                    />
                                </td>
                                <td className="border-t border-gray-400 p-2 flex space-x-2 justify-center items-center">


                                    <button
                                        onClick={() => handleDeleteCategory(category.id)}
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

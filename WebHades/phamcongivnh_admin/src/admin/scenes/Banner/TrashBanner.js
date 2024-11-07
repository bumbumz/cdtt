import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { BsTrash2 } from "react-icons/bs";
import { BannerService } from '../../../Api'; // Đảm bảo nhập đúng
import Switch from "react-switch";
export default function TrashBanner() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await BannerService.getTrash();
                setBanners(response.banners);
            } catch (err) {
                console.error("Error fetching banner:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBanner();
    }, []);

    if (loading) return <div>Loading banner...</div>;
    if (error) return <div>Error loading banner!</div>;
    console.log("cate:", banners)

    // Handle form submission to add a new category


    // Handle delete category
    const handleDeleteBanner = async (id) => {
        console.log("id", id)
        if (window.confirm("Are you sure you want to delete this banner?")) {
            try {
                await BannerService.trashdelete(id)
                setBanners(banners.filter(banner => banner.id !== id));
            } catch (err) {
                console.error("Error deleting banner:", err);
                setError(err);
            }
        };
    }
    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 2 : 1; // Chuyển đổi giữa 1 và 0
        console.log(`Updating status for product ID: ${id}, New Status: ${newStatus}`);

        try {
            await BannerService.editstatus(id, { status: newStatus }); // Gọi API để cập nhật trạng thái
            setBanners(banners.map(banner =>
                banner.id === id ? { ...banner, status: newStatus } : banner
            ));
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    return (
        <div className="p-4 space-x-2">
            <h1 className="text-2xl font-semibold mb-6 text-white ">Quản lý Giỏ Rác Banner</h1>

            {/* Button to navigate to AddBanner form */}
            <Link
                to="/admin/banner"
                className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
            >
                <IoIosArrowBack />
            </Link>
            <Link
                to="/admin/banner/trash"
                className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
            >
                <BsTrash2 />
            </Link>

            {/* Display list of categories */}
            {banners.length === 0 ? (
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
                        {banners.map(banner => (
                            <tr key={banner.id} className="hover:bg-gray-700 text-white">
                                <td className="border border-gray-400 p-2">{banner.id}</td>
                                <td className="border border-gray-400 p-2">{banner.name}</td>
                                <td className="border border-gray-400 p-2">
                                    <img
                                        src={banner.image}
                                        alt={banner.name}
                                        className="w-24 h-auto"
                                    />
                                </td>
                                <td className="border border-gray-400 p-2">{banner.description}</td>
                                <td className="border border-gray-400 p-2">{banner.parent_id}</td>
                                <td className="border border-gray-400 p-2">
                                    <Switch
                                        onChange={() => handleStatusChange(banner.id, banner.status)}
                                        checked={banner.status === 1}
                                        onColor="#4CAF50" // Màu khi bật
                                        offColor="#FF4136" // Màu khi tắt
                                    />
                                </td>
                                <td className="border-t border-gray-400 p-2 flex space-x-2 justify-center items-center">


                                    <button
                                        onClick={() => handleDeleteBanner(banner.id)}
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

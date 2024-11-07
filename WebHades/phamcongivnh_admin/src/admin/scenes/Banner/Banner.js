import React, { useEffect, useState } from 'react';
import { BannerService } from '../../../Api';
import Switch from "react-switch";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { BsTrash2 } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
function Banner() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await BannerService.getList();
                if (response && response.banners) {
                    setBanners(response.banners); // Lưu danh sách banner
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

        fetchBanners();
    }, []);

    if (loading) return <div>Loading banners...</div>;
    if (error) return <div>Error loading banners!</div>;
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
    const handleDeletebanner = async (id) => {
        if (window.confirm("Are you sure you want to delete this brand?")) {
            try {
                await BannerService.delete(id);
                // Remove the deleted brand from the state
                setBanners(banners.filter(banner => banner.id !== id));
            } catch (err) {
                console.error("Error deleting brand:", err);
                setError(err);
            }
        }
    };
    return (
        <div className="p-4 space-x-2">
            <h1 className="text-2xl font-semibold mb-6 text-white">Quản lý Banner</h1>
            <Link
                to="/admin/banner/add"
                className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
            >
                <IoMdAddCircleOutline />
            </Link>
            <Link
                to="/admin/banner/trash"
                className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
            >
                <BsTrash2 />
            </Link>

            <table className="min-w-full border-collapse border border-gray-400">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="border border-gray-400 p-2">ID</th>
                        <th className="border border-gray-400 p-2">Tên Banner</th>
                        <th className="border border-gray-400 p-2">Hình Ảnh</th>
                        <th className="border border-gray-400 p-2">Trạng Thái</th>
                        <th className="border border-gray-400 p-2">Vị Trí</th>
                        <th className="border border-gray-400 p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {banners.map((banner) => (
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
                            <td className="border border-gray-400 p-2">
                                <Switch
                                    onChange={() => handleStatusChange(banner.id, banner.status)}
                                    checked={banner.status === 1}
                                    onColor="#4CAF50" // Màu khi bật
                                    offColor="#FF4136" // Màu khi tắt
                                />
                            </td>
                            <td className="border border-gray-400 p-2">{banner.position}</td>
                            <td className="border-t border-gray-400 p-2 flex space-x-2  items-start justify-center ">
                                <Link
                                    to={`/admin/banner/edit/${banner.id}`}
                                    className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition inline-flex items-center"
                                >
                                    <FaEdit />
                                </Link>
                                <button
                                    onClick={() => handleDeletebanner(banner.id)}
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

export default Banner;

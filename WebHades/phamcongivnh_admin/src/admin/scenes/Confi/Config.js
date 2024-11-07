import React, { useEffect, useState } from 'react';
import { ConfigService } from '../../../Api';
import { FaEdit } from "react-icons/fa";
import { Link } from 'react-router-dom';

function Config() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await ConfigService.getList();
                if (response && response.config) {
                    setBanners(response.config); // Lưu danh sách banner
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
            await ConfigService.editstatus(id, { status: newStatus }); // Gọi API để cập nhật trạng thái
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
                await ConfigService.delete(id);
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


            <table className="min-w-full border-collapse border border-gray-400">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="border border-gray-400 p-2">ID</th>
                        <th className="border border-gray-400 p-2">Tên </th>
                        <th className="border border-gray-400 p-2">Email</th>
                        <th className="border border-gray-400 p-2">Số điện thoại</th>
                        <th className="border border-gray-400 p-2">Địa chỉ</th>
                        <th className="border border-gray-400 p-2">Số điện thoại</th>
                        <th className="border border-gray-400 p-2">Zalo</th>
                        <th className="border border-gray-400 p-2">Facebook</th>

                        <th className="border border-gray-400 p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {banners.map((banner) => (
                        <tr key={banner.id} className="hover:bg-gray-700 text-white">
                            <td className="border border-gray-400 p-2">{banner.id}</td>
                            <td className="border border-gray-400 p-2">{banner.site_name}</td>
                            <td className="border border-gray-400 p-2">{banner.email}</td>
                            <td className="border border-gray-400 p-2">{banner.phones}</td>
                            <td className="border border-gray-400 p-2">{banner.address}</td>
                            <td className="border border-gray-400 p-2">{banner.hotline}</td>
                            <td className="border border-gray-400 p-2">{banner.zalo}</td>
                            <td className="border border-gray-400 p-2">{banner.facebook}</td>
                            <td className="border-t border-gray-400 p-2 flex space-x-2  items-start justify-center ">
                                <Link
                                    to={`/admin/config/edit/${banner.id}`}
                                    className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition inline-flex items-center"
                                >
                                    <FaEdit />
                                </Link>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Config;

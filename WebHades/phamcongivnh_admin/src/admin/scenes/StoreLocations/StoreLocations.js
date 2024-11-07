import React, { useEffect, useState } from 'react';
import { StoreLocationsService } from '../../../Api';
import { Link } from 'react-router-dom';
import { BsTrash2 } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

function StoreLocations() {
    const [storeLocations, setStoreLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStoreLocations = async () => {
            try {
                const response = await StoreLocationsService.getList();
                if (response && response.storelocations) {
                    setStoreLocations(response.storelocations);
                } else {
                    console.error("Unexpected response format:", response);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching store locations:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchStoreLocations();
    }, []);

    if (loading) return <div>Loading store locations...</div>;
    if (error) return <div>Error loading store locations!</div>;

    return (
        <div className="p-4 space-x-2">
            <h1 className="text-2xl font-semibold mb-6 text-white">Quản lý Địa Điểm Cửa Hàng</h1>
            <Link
                to="/admin/storelocations/add"
                className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
            >
                <IoMdAddCircleOutline /> Thêm Địa Điểm
            </Link>
            <Link
                to="/admin/storelocations/trash"
                className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
            >
                <BsTrash2 /> Thùng Rác
            </Link>

            <table className="min-w-full border-collapse border border-gray-400">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="border border-gray-400 p-2">ID</th>
                        <th className="border border-gray-400 p-2">Địa Điểm</th>
                        <th className="border border-gray-400 p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {storeLocations.map((location) => (
                        <tr key={location.id} className="hover:bg-gray-700 text-white">
                            <td className="border border-gray-400 p-2">{location.id}</td>
                            <td className="border border-gray-400 p-2">{location.text}</td>
                            <td className="border-t border-gray-400 p-2 flex space-x-2 items-center justify-center">
                                <Link
                                    to={`/admin/storelocations/edit/${location.id}`}
                                    className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition inline-flex items-center"
                                >
                                    <FaEdit /> Sửa
                                </Link>
                                <button
                                    // Uncomment the onClick handler and define handleDelete if deletion functionality is needed
                                    // onClick={() => handleDelete(location.id)}
                                    className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition inline-flex items-center"
                                >
                                    <RiDeleteBin5Line /> Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StoreLocations;

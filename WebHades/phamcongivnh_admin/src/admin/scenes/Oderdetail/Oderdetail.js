import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { RiDeleteBin5Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { OrderDetailService } from '../../../Api'; // Đảm bảo nhập đúng
import Switch from "react-switch";
import { BsTrash2 } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";

export default function Oderdetail() {
    const [brand, setBrand] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchbrand = async () => {
            try {
                const response = await OrderDetailService.getList();
                setBrand(response.orderdetail);
            } catch (err) {
                console.error("Error fetching brand:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchbrand();
    }, []);

    if (loading) return <div>Loading brand...</div>;
    if (error) return <div>Error loading brand!</div>;
    console.log("brand:", brand)
    const handleDeletebrand = async (id) => {
        if (window.confirm("Are you sure you want to delete this brand?")) {
            try {
                await OrderDetailService.delete(id);
                // Remove the deleted brand from the state
                setBrand(brand.filter(brand => brand.id !== id));
            } catch (err) {
                console.error("Error deleting brand:", err);
                setError(err);
            }
        }
    };
    return (
        <div className="p-4 space-x-2">
            <h1 className="text-2xl font-semibold mb-6 text-white">Quản lý Order</h1>
            (
            <table className="min-w-full border-collapse border border-gray-400">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="border border-gray-400 p-2">Id người mua</th>
                        <th className="border border-gray-400 p-2">Tên người dùng</th>
                        <th className="border border-gray-400 p-2">Email</th>
                        <th className="border border-gray-400 p-2">Phone</th>
                        <th className="border border-gray-400 p-2">Address</th>
                        <th className="border border-gray-400 p-2">Tên sản phẩm</th>
                        <th className="border border-gray-400 p-2">Giá sản phẩm</th>
                        <th className="border border-gray-400 p-2">Số lượng</th>
                        <th className="border border-gray-400 p-2">Giảm giá</th>
                        <th className="border border-gray-400 p-2">Thành giá</th>
                        <th className="border border-gray-400 p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {brand.map(brand => (
                        <tr key={brand.id} className="hover:bg-gray-700 text-white">
                            <td className="border border-gray-400 p-2">{brand.user_id}</td>
                            <td className="border border-gray-400 p-2">{brand.user_name}</td>
                            <td className="border border-gray-400 p-2">{brand.user_email}</td>
                            <td className="border border-gray-400 p-2">{brand.user_phone}</td>
                            <td className="border border-gray-400 p-2">{brand.user_address}</td>
                            <td className="border border-gray-400 p-2">{brand.product_name}</td>
                            <td className="border border-gray-400 p-2">{brand.product_price}</td>

                            <td className="border border-gray-400 p-2">{brand.qty}</td>
                            <td className="border border-gray-400 p-2">{brand.discount}</td>
                            <td className="border border-gray-400 p-2">{(brand.amount)}</td>
                            <td className="border-t border-gray-400 p-2 flex space-x-2  items-start justify-center ">
                                <button
                                    onClick={() => handleDeletebrand(brand.id)}
                                    className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition inline-flex items-center">

                                    <RiDeleteBin5Line />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import Switch from "react-switch"; // Nhập thư viện switch
import { ProductSale } from '../../../Api';

export default function ProSale() {
    const [products, setProducts] = useState([]);

    // Lấy danh sách sản phẩm từ API khi component được render
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductSale.getList();
                setProducts(response);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        fetchProducts();
    }, [products]);

    // Handle delete product
    const handleDeleteProduct = (id) => {
        setProducts(products.filter(product => product.id !== id));
    };

    // Handle status change
    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 2 : 1; // Chuyển đổi giữa 1 và 0
        console.log(`Updating status for product ID: ${id}, New Status: ${newStatus}`);

        try {
            await ProductSale.editstatus(id, { status: newStatus }); // Gọi API để cập nhật trạng thái
            setProducts(products.map(product =>
                product.id === id ? { ...product, status: newStatus } : product
            ));
            
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-6 text-white">Quản lý sản phẩm giảm giá</h1>

            {/* Button to navigate to AddProduct form */}
            <Link
                to="/admin/product/add"
                className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
            >
                <IoMdAddCircleOutline />
            </Link>

            {/* Display list of products */}
            <table className="min-w-full border-collapse border border-gray-400">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="border border-gray-400 p-2">#</th>
                        <th className="border border-gray-400 p-2">Id sản phẩm</th>
                        <th className="border border-gray-400 p-2">Tên</th>
                        <th className="border border-gray-400 p-2">Hình</th>
                        <th className="border border-gray-400 p-2">Giá giảm</th>
                        <th className="border border-gray-400 p-2">Ngày bắt đầu</th>
                        <th className="border border-gray-400 p-2">Ngày kết thúc</th>
                        <th className="border border-gray-400 p-2">Ngày tạo</th>
                        <th className="border border-gray-400 p-2">Ngày cập nhật</th>
                        <th className="border border-gray-400 p-2">Trạng thái</th>
                        <th className="border border-gray-400 p-2 h-full">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} className="hover:bg-gray-700 text-white">
                            <td className="border border-gray-400 p-2">{product.id}</td>
                            <td className="border border-gray-400 p-2">{product.product_id}</td>
                            <td className="border border-gray-400 p-2">{product.name}</td>
                            <td className="border border-gray-400 p-2">
                                <img
                                    src={product.thumbnail}
                                    alt={product.name}
                                    className="w-24 h-auto"
                                />
                            </td>
                            <td className="border border-gray-400 p-2">${product.pricesale}</td>
                            <td className="border border-gray-400 p-2">{product.datebegin}</td>
                            <td className="border border-gray-400 p-2">{product.dateend}</td>
                            <td className="border border-gray-400 p-2">{product.created_at}</td>
                            <td className="border border-gray-400 p-2">{product.updated_at}</td>
                            <td className="border border-gray-400 p-2">
                                <Switch
                                    onChange={() => handleStatusChange(product.id, product.status)}
                                    checked={product.status === 1}
                                    onColor="#4CAF50" // Màu khi bật
                                    offColor="#FF4136" // Màu khi tắt
                                />
                            </td>
                            <td className="border-t border-gray-400 p-2 flex space-x-2">
                                <Link
                                    to={`/admin/productsale/edit/${product.id}`}
                                    className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition inline-flex items-center"
                                >
                                    <FaEdit />
                                </Link>
                                <button
                                    onClick={() => handleDeleteProduct(product.id)}
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

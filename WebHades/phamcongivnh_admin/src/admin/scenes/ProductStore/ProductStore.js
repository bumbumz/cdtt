import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import Switch from "react-switch"; // Nhập thư viện switch
import { ProductService, ProductStore } from '../../../Api';
import { BsTrash2 } from 'react-icons/bs';

export default function ProductStoreComponent() {
    const [products, setProducts] = useState([]);

    // Lấy danh sách sản phẩm từ API khi component được render
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductStore.getList();
                console.log("response", response)
                setProducts(response);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        fetchProducts();
    }, [products]);
    console.log("produc store", products)

    // Handle delete product
    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await ProductService.upTrash(id);
                // Remove the deleted brand from the state
                setProducts(products.filter(brand => brand.product_id !== id));
            } catch (err) {
                console.error("Error deleting brand:", err);

            }
        }
    };

    // Handle status change
    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 2 : 1; // Chuyển đổi giữa 1 và 0
        console.log(`Updating status for product ID: ${id}, New Status: ${newStatus}`);

        try {
            await ProductStore.editstatus(id, { status: newStatus }); // Gọi API để cập nhật trạng thái
            setProducts(products.map(product =>
                product.id === id ? { ...product, status: newStatus } : product
            ));

        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-6 text-white">Quản lý sản phẩm kho</h1>

            <Link
                to="/admin/brand/add"
                className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
            >
                <IoMdAddCircleOutline />
            </Link>
            <Link
                to="/admin/productstore/trash"
                className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
            >
                <BsTrash2 />
            </Link>
            <table className="min-w-full border-collapse border border-gray-400">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="border border-gray-400 p-2">#</th>
                        <th className="border border-gray-400 p-2">Id sản phẩm</th>
                        <th className="border border-gray-400 p-2">Tên</th>
                        <th className="border border-gray-400 p-2">Hình</th>
                        <th className="border border-gray-400 p-2">Giá nhập</th>
                        <th className="border border-gray-400 p-2">Số lượng</th>
                        <th className="border border-gray-400 p-2">Ngày nhập kho</th>
                        <th className="border border-gray-400 p-2">Ngày tạo</th>
                        <th className="border border-gray-400 p-2">Ngày cập nhật</th>
                        <th className="border border-gray-400 p-2">Tạo bởi</th>
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
                            <td className="border border-gray-400 p-2">${product.priceroot}</td>
                            <td className="border border-gray-400 p-2">{product.qty}</td>
                            <td className="border border-gray-400 p-2">{product.dateimport}</td>
                            <td className="border border-gray-400 p-2">{product.created_at}</td>
                            <td className="border border-gray-400 p-2">{product.updated_at}</td>
                            <td className="border border-gray-400 p-2">{product.created_by}</td>
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
                                    to={`/admin/productstore/edit/${product.id}`}
                                    className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition inline-flex items-center"
                                >
                                    <FaEdit />
                                </Link>
                                <button
                                    onClick={() => handleDeleteProduct(product.product_id)}
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

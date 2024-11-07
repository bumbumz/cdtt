import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../../../Api'; // Giả sử ProductService dùng để xử lý các gọi API

export default function AddProduct() {
    // State quản lý các thuộc tính của sản phẩm
    const [product, setProduct] = useState({
        name: '',
        slug: '',
        category_id: '',
        brand_id: '',
        content: '',
        description: '',
        pricebuy: '',
        image: '',
        priceroot: '',
        qty: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Hàm thay đổi giá trị các input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value,
        });
    };

    // Hàm thay đổi file hình ảnh
    const handleFileChange = (e) => {
        setProduct({
            ...product,
            image: e.target.files[0], // Lưu tệp hình ảnh
        });
    };

    // Xử lý việc gửi form thêm sản phẩm
    const handleAddProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData(); // Tạo form data để gửi kèm hình ảnh
        formData.append('name', product.name);
        formData.append('slug', product.slug);
        formData.append('category_id', product.category_id);
        formData.append('brand_id', product.brand_id);
        formData.append('content', product.content);
        formData.append('description', product.description);
        formData.append('pricebuy', product.pricebuy);
        formData.append('priceroot', product.priceroot);
        formData.append('qty', product.qty);
        formData.append('image', product.image); // Gửi hình ảnh

        try {
            const response = await ProductService.add(formData);
            console.log('Product added:', response.data);

            // Điều hướng sau khi thêm sản phẩm thành công
            navigate('/admin/product');
        } catch (error) {
            console.error('Error adding product:', error);
            setError('Failed to add product. Please try again.');
        }
    };

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-semibold mb-6 text-white">Thêm sản phẩm mới</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleAddProduct} className="bg-gray-100 p-6 rounded-lg shadow-md">
                <div className="flex flex-col space-y-4">
                    {/* Tên sản phẩm */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Tên sản phẩm"
                        value={product.name}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-lg p-3"
                    />

                    {/* Slug */}
                    <input
                        type="text"
                        name="slug"
                        placeholder="Slug"
                        value={product.slug}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-lg p-3"
                    />

                    {/* Category ID */}
                    <input
                        type="text"
                        name="category_id"
                        placeholder="Category ID"
                        value={product.category_id}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-lg p-3"
                    />

                    {/* Brand ID */}
                    <input
                        type="text"
                        name="brand_id"
                        placeholder="Brand ID"
                        value={product.brand_id}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-lg p-3"
                    />

                    {/* Nội dung sản phẩm */}
                    <input
                        type="text"
                        name="content"
                        placeholder="Nội dung sản phẩm"
                        value={product.content}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-lg p-3"
                    />

                    {/* Mô tả sản phẩm */}
                    <textarea
                        name="description"
                        placeholder="Mô tả sản phẩm"
                        value={product.description}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-lg p-3"
                    />

                    {/* Giá nhập */}
                    <input
                        type="number"
                        name="pricebuy"
                        placeholder="Giá nhập"
                        value={product.pricebuy}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-lg p-3"
                    />

                    {/* Giá gốc */}
                    <input
                        type="number"
                        name="priceroot"
                        placeholder="Giá gốc"
                        value={product.priceroot}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-lg p-3"
                    />

                    {/* Số lượng */}
                    <input
                        type="number"
                        name="qty"
                        placeholder="Số lượng"
                        value={product.qty}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-lg p-3"
                    />

                    {/* Ảnh sản phẩm */}
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="border border-gray-300 rounded-lg p-3"
                    />

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                    >
                        Thêm sản phẩm
                    </button>
                </div>
            </form>
        </div>
    );
}

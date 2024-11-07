import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { ProductService } from '../../../Api'; // Đảm bảo đường dẫn đúng

export default function EditProduct() {
    const { id } = useParams(); // Lấy ID từ URL

    // Khởi tạo state để lưu trữ thông tin sản phẩm
    const [product, setProduct] = useState({
        name: '',
        pricebuy: '',
        description: '',
        slug: '',
        category_id: '',
        brand_id: '',
        content: '',
    });

    const [image, setImage] = useState(null); // State để lưu hình ảnh
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy thông tin sản phẩm từ API khi component được render
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await ProductService.getId(id); // Gọi API lấy thông tin sản phẩm
                const dapro = response.product;
                if (dapro) {
                    setProduct({
                        name: dapro.name || '',
                        pricebuy: dapro.pricebuy || '',
                        description: dapro.description || '',
                        slug: dapro.slug || '',
                        category_id: dapro.category_id || '',
                        brand_id: dapro.brand_id || '',
                        content: dapro.content || '',
                    });
                    setImage(dapro.image); // Gán đường dẫn hình ảnh hiện có
                } else {
                    throw new Error('Product not found');
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Xử lý khi thay đổi giá trị input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Xử lý khi người dùng chọn ảnh mới
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file); // Cập nhật state hình ảnh
    };

    // Xử lý khi submit form cập nhật sản phẩm
    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('pricebuy', product.pricebuy);
        formData.append('description', product.description);
        formData.append('slug', product.slug);
        formData.append('category_id', product.category_id);
        formData.append('brand_id', product.brand_id);
        formData.append('content', product.content);
        if (image) {
            formData.append('image', image); // Đính kèm file ảnh nếu có
        }

        try {
            await ProductService.update(id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/admin/product'); // Điều hướng về danh sách sản phẩm sau khi cập nhật
        } catch (err) {
            console.error("Error updating product:", err.response ? err.response.data : err.message);
            setError('Failed to update product.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-semibold mb-6 text-white">Chỉnh Sửa Sản Phẩm</h1>
            <form onSubmit={handleUpdateProduct} className="mb-6 flex flex-col space-y-4">
                <p className='text-white'>Tên sản phẩm</p>
                <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Tên sản phẩm"
                    required
                />

                <p className='text-white'>Slug</p>
                <input
                    type="text"
                    name="slug"
                    value={product.slug}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Slug sản phẩm"
                    required
                />

                <p className='text-white'>Giá mua</p>
                <input
                    type="number"
                    name="pricebuy"
                    value={product.pricebuy}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Giá mua"
                    required
                />

                <p className='text-white'>Mô tả</p>
                <textarea
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Mô tả sản phẩm"
                    required
                />

                <p className='text-white'>Danh mục</p>
                <input
                    type="number"
                    name="category_id"
                    value={product.category_id}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="ID danh mục"
                    required
                />

                <p className='text-white'>Thương hiệu</p>
                <input
                    type="number"
                    name="brand_id"
                    value={product.brand_id}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="ID thương hiệu"
                    required
                />

                <p className='text-white'>Nội dung</p>
                <textarea
                    name="content"
                    value={product.content}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Nội dung sản phẩm"
                    required
                />

                <p className="text-white">Hình ảnh sản phẩm</p>
                {/* Hiển thị ảnh hiện tại */}
                
                <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    className="border px-4 py-2 rounded-lg"
                />

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                    <FaEdit className="mr-2" /> Cập Nhật
                </button>
            </form>
        </div>
    );
}

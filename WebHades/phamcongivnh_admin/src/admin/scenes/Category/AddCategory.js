import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryService } from '../../../Api';

function AddCategory() {
    const [category, setCategory] = useState({
        name: '',
        slug: '',
        image: null,
        description: '',
        // Sử dụng null cho file hình ảnh

    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategory({
            ...category,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setCategory({
            ...category,
            image: e.target.files[0], // Lưu tệp hình ảnh
        });
    };

    const handleAddBrand = async (e) => {
        e.preventDefault();

        const formData = new FormData(); // Tạo form data để gửi kèm hình ảnh
        formData.append('name', category.name);
        formData.append('slug', category.slug);
        formData.append('image', category.image); // Gửi hình ảnh
        formData.append('description', category.description);



        try {
            await CategoryService.add(formData); // Gọi API thêm brand
            navigate('/admin/category'); // Điều hướng về trang danh sách thương hiệu sau khi thêm thành công
        } catch (error) {
            setError('Có lỗi xảy ra khi thêm thương hiệu');
            console.error(error);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Thêm Category</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleAddBrand} className="space-y-4">
                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Tên Category:</label>
                    <input
                        type="text"
                        name="name"
                        value={category.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Slug:</label>
                    <input
                        type="text"
                        name="slug"
                        value={category.slug}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Hình ảnh:</label>
                    <input
                        type="file"
                        name="image"
                        accept="images/category/*"
                        onChange={handleFileChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Mô tả:</label>
                    <textarea
                        name="description"
                        value={category.description}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                

                

                <button

                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Thêm Thương Hiệu
                </button>
            </form>
        </div>
    );
}

export default AddCategory;

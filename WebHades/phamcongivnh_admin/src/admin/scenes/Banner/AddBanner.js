import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BannerService } from '../../../Api';

function AddBanner() {
    const [banners, setBanners] = useState({
        name: '',
        link: '',
        image: '',
        description: '',
        position: '',
        sort_order: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBanners({
            ...banners,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setBanners({
            ...banners,
            image: e.target.files[0], // Lưu tệp hình ảnh
        });
    };

    const handleAddBanner = async (e) => {
        e.preventDefault();

        const formData = new FormData(); // Tạo form data để gửi kèm hình ảnh
        formData.append('name', banners.name);
        formData.append('link', banners.link);
        formData.append('image', banners.image);
        formData.append('description', banners.description);
        formData.append('position', banners.position);
        formData.append('sort_order', banners.sort_order);

        try {
            await BannerService.add(formData); // Gọi API thêm banners
            navigate('/admin/banner'); // Điều hướng về trang danh sách banner sau khi thêm thành công
        } catch (error) {
            setError('Có lỗi xảy ra khi thêm banner');
            console.error(error);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Thêm Banner</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleAddBanner} className="space-y-4">
                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Tên Banner:</label>
                    <input
                        type="text"
                        name="name"
                        value={banners.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Link:</label>
                    <input
                        type="text"
                        name="link"
                        value={banners.link}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Mô tả:</label>
                    <textarea
                        name="description"
                        value={banners.description}
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
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Vị trí:</label>
                    <select
                        name="position"
                        value={banners.position}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Chọn vị trí</option>
                        <option value="slideshow">Slideshow</option>
                        <option value="ads">Ads</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Thứ tự:</label>
                    <input
                        type="number"
                        name="sort_order"
                        value={banners.sort_order}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Thêm Banner
                </button>
            </form>
        </div>
    );
}

export default AddBanner;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { BannerService } from '../../../Api';

export default function EditBanner() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [banners, setBanner] = useState({
        name: '',
        link: '',
        image: '',
        description: '',
        position: '',
        sort_order: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await BannerService.getId(id);
                const databanner = response.banner;
                if (databanner) {
                    setBanner({
                        name: databanner.name || '',
                        link: databanner.link || '',
                        image: databanner.image || '',
                        description: databanner.description || '',
                        position: databanner.position || '',
                        sort_order: databanner.sort_order || '',
                    });
                } else {
                    throw new Error('Banner not found');
                }
            } catch (err) {
                console.error("Error fetching banner:", err);
                setError('Failed to load banner details.');
            } finally {
                setLoading(false);
            }
        };

        fetchBanner();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBanner(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdateBanner = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', banners.name);
        formData.append('link', banners.link);

        if (banners.image) {
            formData.append('image', banners.image);
        }

        formData.append('description', banners.description);
        formData.append('position', banners.position);
        formData.append('sort_order', banners.sort_order);

        try {
            await BannerService.update(id, formData); // Gửi FormData lên backend
            navigate('/admin/banner');
        } catch (err) {
            console.error("Error updating banner:", err.response ? err.response.data : err.message);
            setError('Failed to update banner.');
        }
    };

    const handleFileChange = (e) => {
        setBanner(prevState => ({
            ...prevState,
            image: e.target.files[0] // Cập nhật file hình ảnh khi được chọn
        }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-semibold mb-6 text-white">Chỉnh Sửa Banner</h1>
            <form onSubmit={handleUpdateBanner} className="mb-6 flex flex-col space-y-4">
                <p className='text-white'>Tên</p>
                <input
                    type="text"
                    name="name"
                    value={banners.name}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Tên banner"
                    required
                />

                <p className='text-white'>Link</p>
                <input
                    type="text"
                    name="link"
                    value={banners.link}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Link"
                    required
                />

                <p className='text-white'>Chi tiết</p>
                <input
                    type="text"
                    name="description"
                    value={banners.description}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Chi tiết banner"
                    required
                />

                <p className='text-white'>Hình ảnh</p>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border px-4 py-2 rounded-lg"
                />

                <p className='text-white'>Vị trí</p>
                <select
                    name="position"
                    value={banners.position}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    required
                >
                    <option value="">Chọn vị trí</option>
                    <option value="slideshow">Slideshow</option>
                    <option value="ads">Ads</option>
                </select>

                <p className='text-white'>Số thứ tự</p>
                <input
                    type="number"
                    name="sort_order"
                    value={banners.sort_order}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Số thứ tự"
                />

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                    <FaEdit className="mr-2" /> Cập Nhật
                </button>
            </form>
        </div>
    );
}

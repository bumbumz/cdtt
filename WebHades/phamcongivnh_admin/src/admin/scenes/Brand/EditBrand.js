import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { BrandService } from '../../../Api'; // Đảm bảo đường dẫn đúng

export default function EditBrand() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [brand, setBrand] = useState({
        name: '',
        slug: '',
        description: '',
        image: '',
        status: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const response = await BrandService.getId(id);
                const databrand = response.brand;
                console.log("databrand", databrand);
                if (databrand) {
                    setBrand({
                        name: databrand.name || '',
                        slug: databrand.slug || '',
                        description: databrand.description || '',
                        image: databrand.image || '',
                        status: databrand.status || '',
                    });
                } else {
                    throw new Error('Brand not found');
                }
            } catch (err) {
                console.error("Error fetching brand:", err);
                setError('Failed to load brand details.');
            } finally {
                setLoading(false);
            }
        };

        fetchBrand();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBrand(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdateBrand = async (e) => {
        e.preventDefault();
        console.log('Updating brand with data:', brand);

        // Tạo FormData và thêm các field từ brand
        const formData = new FormData();
        formData.append('name', brand.name);
        formData.append('slug', brand.slug);
        formData.append('description', brand.description);
        formData.append('status', brand.status);

        // Kiểm tra và thêm file ảnh nếu có
        if (brand.image) {
            formData.append('image', brand.image);
        }

        try {
            await BrandService.update(id, formData); // Gửi FormData lên backend
            navigate('/admin/brand');
        } catch (err) {
            console.error("Error updating brand:", err.response ? err.response.data : err.message);
            setError('Failed to update brand.');
        }
    };
    const handleFileChange = (e) => {
        setBrand(prevState => ({
            ...prevState,
            image: e.target.files[0] // Cập nhật file hình ảnh khi được chọn
        }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-semibold mb-6 text-white">Chỉnh Sửa Thương Hiệu</h1>
            <form onSubmit={handleUpdateBrand} className="mb-6 flex flex-col space-y-4">
                <p className='text-white'>Tên</p>
                <input
                    type="text"
                    name="name"
                    value={brand.name}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Tên thương hiệu"
                    required
                />

                <p className='text-white'>Slug</p>
                <input
                    type="text"
                    name="slug"
                    value={brand.slug}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Slug"
                    required
                />

                <p className='text-white'>Chi tiết</p>
                <input
                    type="text"
                    name="description"
                    value={brand.description}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Chi tiết thương hiệu"
                    required
                />
                <p className='text-white'>Hình ảnh</p>
                <input
                    type="file"
                    name="image"
                    accept="images/brand"
                    onChange={handleFileChange}
                    className="border px-4 py-2 rounded-lg"
                />

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                    <FaEdit className="mr-2" /> Cập Nhật
                </button>
            </form>
        </div>
    );
}

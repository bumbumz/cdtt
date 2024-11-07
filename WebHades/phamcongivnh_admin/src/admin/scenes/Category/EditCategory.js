import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { CategoryService } from '../../../Api'; // Đảm bảo đường dẫn đúng

export default function EditCategory() {
    const { id } = useParams(); // Lấy ID từ URL
    const [category, setCategory] = useState({
        name: '',
        slug: '',
        description: '',
        sort_order: '1',
        parent_id: '',
        status: '',
        image: null,
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await CategoryService.getId(id); // Lấy danh sách danh mục
                const datacate=response.category;
                if (datacate) {
                    setCategory({
                        name: datacate.name || '',
                        slug: datacate.slug || '',
                        description: datacate.description || '',
                        sort_order: datacate.sort_order || '1',
                        parent_id: datacate.parent_id || '',
                        status: datacate.status || '',
                        image: datacate.image || null,
                    });
                } else {
                    throw new Error('Category not found');
                }
            } catch (err) {
                console.error("Error fetching category:", err);
                setError('Failed to load category details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategory(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setCategory(prevState => ({
            ...prevState,
            image: e.target.files[0] // Cập nhật file hình ảnh khi được chọn
        }));
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();

        // Log dữ liệu trước khi gửi
        console.log('Updating category with data:', {
            name: category.name,
            slug: category.slug,
            description: category.description,
            parent_id: category.parent_id,
            status: category.status,
            image: category.image,
        });

        try {
            const formData = new FormData();
            formData.append('name', category.name);
            formData.append('slug', category.slug);
            formData.append('description', category.description);
            formData.append('sort_order', '1');
            formData.append('parent_id', category.parent_id);
            formData.append('status', category.status);
            if (category.image) {
                formData.append('image', category.image);
            }

            // Gọi API với phương thức POST
            await CategoryService.update(id, formData); // Đảm bảo rằng hàm update cũng đã được cập nhật
            navigate('/admin/category');
        } catch (err) {
            console.error("Error updating category:", err.response ? err.response.data : err.message);
            setError('Failed to update category.');
        }
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-semibold mb-6 text-white">Chỉnh Sửa Danh Mục</h1>
            <form onSubmit={handleUpdateCategory} className="mb-6 flex flex-col space-y-4">
                <p className='text-white'>Tên</p>
                <input
                    type="text"
                    name="name"
                    value={category.name}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Tên danh mục"
                />
                <p className='text-white'>Slug</p>
                <input
                    type="text"
                    name="slug"
                    value={category.slug}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Slug"
                />
                <p className='text-white'>Mô tả</p>
                <textarea
                    name="description"
                    value={category.description}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Mô tả"
                />
                <p className='text-white'>Danh mục cha (parent_id)</p>
                <input
                    type="number"
                    name="parent_id"
                    value={category.parent_id}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Parent ID"
                />
                <p className='text-white'>Trạng thái (status)</p>
                <select
                    name="status"
                    value={category.status}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                >
                    <option value="">Chọn trạng thái</option>
                    <option value="1">Hoạt động</option>
                    <option value="0">Không hoạt động</option>
                </select>
                <p className='text-white'>Hình ảnh</p>
                <input
                    type="file"
                    name="image"
                    accept="images/category"
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

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { PostHomeService } from '../../../Api'; // Đảm bảo đường dẫn đúng

export default function PostHomeEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState({
        name: '',
        conten: '',
        image: '',
        status: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await PostHomeService.getId(id);
                const dataPost = response.post;
                console.log("dataPost", dataPost);
                if (dataPost) {
                    setPost({
                        name: dataPost.name || '',
                        conten: dataPost.conten || '',
                        image: dataPost.image || '',
                        status: dataPost.status || '',
                    });
                } else {
                    throw new Error('Post not found');
                }
            } catch (err) {
                console.error("Error fetching post:", err);
                setError('Failed to load post details.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        console.log('Updating post with data:', post);

        // Tạo FormData và thêm các field từ post
        const formData = new FormData();
        formData.append('name', post.name);
        formData.append('conten', post.conten);
        formData.append('status', post.status);

        // Kiểm tra và thêm file ảnh nếu có
        if (post.image instanceof File) {
            formData.append('image', post.image);
        }

        try {
            await PostHomeService.update(id, formData); // Gửi FormData lên backend
            navigate('/admin/posthome');
        } catch (err) {
            console.error("Error updating post:", err.response ? err.response.data : err.message);
            setError('Failed to update post.');
        }
    };

    const handleFileChange = (e) => {
        setPost(prevState => ({
            ...prevState,
            image: e.target.files[0] // Cập nhật file hình ảnh khi được chọn
        }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-semibold mb-6 text-white">Chỉnh Sửa Bài Viết</h1>
            <form onSubmit={handleUpdatePost} className="mb-6 flex flex-col space-y-4">
                <p className='text-white'>Tên</p>
                <input
                    type="text"
                    name="name"
                    value={post.name}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Tên bài viết"
                    required
                />

                <p className='text-white'>Nội dung</p>
                <textarea
                    name="conten"
                    value={post.conten}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Nội dung bài viết"
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

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                    <FaEdit className="mr-2" /> Cập Nhật
                </button>
            </form>
        </div>
    );
}

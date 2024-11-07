import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostHomeService } from '../../../Api';

function AddPost() {
    const [post, setPost] = useState({
        name: '',
        conten: '',
        image: null, // Use null for the image file
        status: 1,   // Default to '1' for active status
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost({
            ...post,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setPost({
            ...post,
            image: e.target.files[0], // Store the selected image file
        });
    };

    const handleAddPost = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', post.name);
        formData.append('conten', post.conten);
        formData.append('status', post.status);

        // Attach image if it exists
        if (post.image) {
            formData.append('image', post.image);
        }

        try {
            await PostHomeService.add(formData); // Use API to add post
            navigate('/admin/posthome'); // Navigate to post list on success
        } catch (error) {
            setError('Có lỗi xảy ra khi thêm bài viết');
            console.error(error);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Thêm Bài Viết</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleAddPost} className="space-y-4">
                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Tên bài viết:</label>
                    <input
                        type="text"
                        name="name"
                        value={post.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Nội dung:</label>
                    <textarea
                        name="conten"
                        value={post.conten}
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
                        accept="images/post/*"
                        onChange={handleFileChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Trạng thái:</label>
                    <select
                        name="status"
                        value={post.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={1}>Hoạt động</option>
                        <option value={0}>Không hoạt động</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Thêm Bài Viết
                </button>
            </form>
        </div>
    );
}

export default AddPost;

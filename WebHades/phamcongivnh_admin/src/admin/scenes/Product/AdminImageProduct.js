import React, { useState } from 'react';

export default function AdminImageProduct() {
    const [images, setImages] = useState([
        { id: 1, name: 'Espresso.jpg', url: '/images/espresso.jpg' },
        { id: 2, name: 'Cappuccino.jpg', url: '/images/cappuccino.jpg' },
        { id: 3, name: 'Latte.jpg', url: '/images/latte.jpg' },
    ]);
    const [newImage, setNewImage] = useState(null);

    // Handle file input change
    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    // Handle form submission to upload a new image
    const handleAddImage = (e) => {
        e.preventDefault();
        if (newImage) {
            const newImageObj = {
                id: images.length + 1,
                name: newImage.name,
                url: URL.createObjectURL(newImage),  // Temporary URL for preview
            };
            setImages([...images, newImageObj]);
            setNewImage(null);  // Reset file input after adding
        }
    };

    // Handle delete image
    const handleDeleteImage = (id) => {
        setImages(images.filter(image => image.id !== id));
    };

    return (
        <div className="container mx-auto py-4">
            <h1 className="text-xl font-bold mb-4">Quản lý hình ảnh sản phẩm</h1>

            {/* Form to upload a new image */}
            <form onSubmit={handleAddImage} className="mb-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border px-2 py-1 mr-2"
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-1">
                    Tải lên
                </button>
            </form>

            {/* Display list of images */}
            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">#</th>
                        <th className="py-2 px-4 border-b">Hình ảnh</th>
                        <th className="py-2 px-4 border-b">Tên</th>
                        <th className="py-2 px-4 border-b">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {images.map(image => (
                        <tr key={image.id}>
                            <td className="py-2 px-4 border-b">{image.id}</td>
                            <td className="py-2 px-4 border-b">
                                <img src={image.url} alt={image.name} className="w-16 h-16 object-cover" />
                            </td>
                            <td className="py-2 px-4 border-b">{image.name}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => handleDeleteImage(image.id)}
                                    className="bg-red-500 text-white px-3 py-1"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuService } from '../../../Api';

function AddMenu() {
    const [menu, setMenu] = useState({
        name: '',
        link: '',
        type: '',
        table_id: '',
        status: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMenu({
            ...menu,
            [name]: value,
        });
    };

    const handleAddMenu = async (e) => {
        e.preventDefault();

        try {
            await MenuService.createMenu(menu); // Call the createMenu function in MenuService
            navigate('/admin/menu'); // Navigate to the menu list page after successful addition
        } catch (error) {
            setError('Có lỗi xảy ra khi thêm menu');
            console.error(error);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Thêm Menu</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleAddMenu} className="space-y-4">
                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Tên Menu:</label>
                    <input
                        type="text"
                        name="name"
                        value={menu.name}
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
                        value={menu.link}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Loại:</label>
                    <input
                        type="text"
                        name="type"
                        value={menu.type}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Table ID:</label>
                    <input
                        type="number"
                        name="table_id"
                        value={menu.table_id}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Trạng thái:</label>
                    <select
                        name="status"
                        value={menu.status}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Chọn trạng thái</option>
                        <option value="1">Hoạt động</option>
                        <option value="0">Không hoạt động</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Thêm Menu
                </button>
            </form>
        </div>
    );
}

export default AddMenu;

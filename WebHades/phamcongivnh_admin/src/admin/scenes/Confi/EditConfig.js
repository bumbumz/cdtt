import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { ConfigService } from '../../../Api';

export default function EditConfig() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [config, setConfig] = useState({
        site_name: '',
        email: '',
        phones: '',
        address: '',
        hotline: '',
        zalo: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await ConfigService.getId(id);
                const dataconfig = response.config;
                if (dataconfig) {
                    setConfig({
                        site_name: dataconfig.site_name || '',
                        email: dataconfig.email || '',
                        phones: dataconfig.phones || '',
                        address: dataconfig.address || '',
                        hotline: dataconfig.hotline || '',
                        zalo: dataconfig.zalo || '',
                    });
                } else {
                    throw new Error('Config not found');
                }
            } catch (err) {
                console.error("Error fetching config:", err);
                setError('Failed to load config details.');
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConfig(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdateConfig = async (e) => {
        e.preventDefault();

        try {
            await ConfigService.update(id, config); // Sending config object as JSON
            navigate('/admin/config');
        } catch (err) {
            console.error("Error updating config:", err.response ? err.response.data : err.message);
            setError('Failed to update config.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-semibold mb-6 text-white">Chỉnh Sửa Cấu Hình</h1>
            <form onSubmit={handleUpdateConfig} className="mb-6 flex flex-col space-y-4">
                <p className='text-white'>Tên trang web</p>
                <input
                    type="text"
                    name="site_name"
                    value={config.site_name}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Tên trang web"
                    required
                />

                <p className='text-white'>Email</p>
                <input
                    type="text"
                    name="email"
                    value={config.email}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Email"
                    required
                />

                <p className='text-white'>Số điện thoại</p>
                <input
                    type="text"
                    name="phones"
                    value={config.phones}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Số điện thoại"
                    required
                />

                <p className='text-white'>Địa chỉ</p>
                <input
                    type="text"
                    name="address"
                    value={config.address}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Địa chỉ"
                />

                <p className='text-white'>Hotline</p>
                <input
                    type="text"
                    name="hotline"
                    value={config.hotline}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Hotline"
                />

                <p className='text-white'>Zalo</p>
                <input
                    type="text"
                    name="zalo"
                    value={config.zalo}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Zalo"
                />

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                    <FaEdit className="mr-2" /> Cập Nhật
                </button>
            </form>
        </div>
    );
}

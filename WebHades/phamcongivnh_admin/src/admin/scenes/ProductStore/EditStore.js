import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { ProductStore } from '../../../Api'; // Đảm bảo đường dẫn đúng

export default function EditStore() {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();

    const [productStore, setProductStore] = useState({
        priceroot: '',  // Giá gốc
        qty: ''         // Số lượng
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductStore = async () => {
            try {
                const response = await ProductStore.getId(id); // Gọi API lấy thông tin từ db_productstore

                if (response) {
                    setProductStore({
                        priceroot: response.priceroot || '',  // Gán giá trị priceroot
                        qty: response.qty || ''               // Gán giá trị qty
                    });
                } else {
                    throw new Error('Product store not found');
                }
            } catch (err) {
                console.error("Error fetching product store:", err);
                setError('Failed to load product store details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductStore();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductStore(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdateProductStore = async (e) => {
        e.preventDefault();

        console.log('Updating product store with data:', productStore);

        try {
            await ProductStore.update(id, productStore); // Gọi API cập nhật sản phẩm trong kho
            navigate('/admin/productstore'); // Điều hướng về trang danh sách sản phẩm trong kho
        } catch (err) {
            console.error("Error updating product store:", err.response ? err.response.data : err.message);
            setError('Failed to update product store.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-semibold mb-6 text-white">Chỉnh Sửa Sản Phẩm Trong Kho</h1>
            <form onSubmit={handleUpdateProductStore} className="mb-6 flex flex-col space-y-4">
                <p className='text-white'>Giá gốc</p>
                <input
                    type="number"
                    name="priceroot"
                    value={productStore.priceroot}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Giá gốc"
                    required
                />

                <p className='text-white'>Số lượng</p>
                <input
                    type="number"
                    name="qty"
                    value={productStore.qty}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Số lượng"
                    required
                />

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                    <FaEdit className="mr-2" /> Cập Nhật
                </button>
            </form>
        </div>
    );
}

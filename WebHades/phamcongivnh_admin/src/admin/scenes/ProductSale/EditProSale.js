import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { ProductSale } from '../../../Api'; // Đảm bảo đường dẫn đúng

export default function EditProSale() {
    const { id } = useParams(); // Lấy ID từ URL

    const [productSale, setProductSale] = useState({
        pricesale: '',
        datebegin: '',
        dateend: '',
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductSale = async () => {
            try {
                const response = await ProductSale.getId(id); // Lấy thông tin sản phẩm giảm giá

                if (response) {
                    setProductSale({
                        pricesale: response.pricesale || '',
                        datebegin: response.datebegin || '',
                        dateend: response.dateend || '',
                    });
                } else {
                    throw new Error('Product sale not found');
                }
            } catch (err) {
                console.error("Error fetching product sale:", err);
                setError('Failed to load product sale details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductSale();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductSale(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdateProductSale = async (e) => {
        e.preventDefault();

        // Log dữ liệu trước khi gửi
        console.log('Updating product sale with data:', productSale);

        try {
            await ProductSale.update(id, productSale); // Gọi API cập nhật sản phẩm giảm giá
            navigate('/admin/productsale'); // Điều hướng đến danh sách sản phẩm giảm giá
        } catch (err) {
            console.error("Error updating product sale:", err.response ? err.response.data : err.message);
            setError('Failed to update product sale.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-semibold mb-6 text-white">Chỉnh Sửa Sản Phẩm Giảm Giá</h1>
            <form onSubmit={handleUpdateProductSale} className="mb-6 flex flex-col space-y-4">
                <p className='text-white'>Giá giảm</p>
                <input
                    type="number"
                    name="pricesale"
                    value={productSale.pricesale}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    placeholder="Giá giảm"
                    required
                />
                <p className='text-white'>Ngày bắt đầu</p>
                <input
                    type="datetime-local"
                    name="datebegin"
                    value={productSale.datebegin}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    required
                />
                <p className='text-white'>Ngày kết thúc</p>
                <input
                    type="datetime-local"
                    name="dateend"
                    value={productSale.dateend}
                    onChange={handleInputChange}
                    className="border px-4 py-2 rounded-lg"
                    required
                />
                
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                    <FaEdit className="mr-2" /> Cập Nhật
                </button>
            </form>
        </div>
    );
}

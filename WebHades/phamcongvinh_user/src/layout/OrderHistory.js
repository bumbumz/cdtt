import React, { useEffect, useState } from 'react';
import { CommentService, OrderService } from '../Api';
import { useNavigate, Link } from 'react-router-dom';

function OrderHistory() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [commentFormVisible, setCommentFormVisible] = useState({});

    const fetch = () => {
        const id = localStorage.getItem('userId');
        OrderService.getList(id)
            .then(response => {
                setData(response.products);
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetch();
    }, []);

    const toggleCommentForm = (productId) => {
        setCommentFormVisible((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };

    const handleCommentSubmit = async (e, productId) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        const comment = e.target.comment.value;
        const imageFile = e.target.image.files[0];

        try {
            const response = await CommentService.comment({
                product_id: productId,
                user_id: userId,
                conten: comment,
                image: imageFile,
            });

            if (response) {

                alert('Comment submitted successfully!');
                navigate('/Home');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to submit comment.');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Lịch Sử Đơn Hàng</h2>

            <div className="space-y-6">
                {data.map((product, index) => (
                    <div
                        key={`${product.id}-${index}`}
                        className="border border-gray-300 rounded-lg p-4 flex flex-col space-y-4"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-24 h-24 overflow-hidden rounded-lg">
                                <Link to="/detail-product" state={{ product }}>
                                    <img
                                        src={product.thumbnail}
                                        alt={product.product_name || "Product Image"}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </Link>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-1">{product.product_name || "Tên Sản Phẩm"}</h3>
                                <p className="text-gray-500 mb-1">Ngày thêm: {new Date(product.created_at).toLocaleDateString()}</p>
                                <p className="text-gray-700">Số lượng: {product.qty}</p>
                                <p className="text-gray-700">Đơn giá: {product.pricebuy.toLocaleString()} VNĐ</p>
                                <p className="text-gray-900 font-semibold">
                                    Tổng: {(product.pricebuy * product.qty).toLocaleString()} VNĐ
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleCommentForm(product.product_id)}
                            className="mt-2 bg-blue-500 text-white py-1 px-4 rounded"
                        >
                            Bình luận về sản phẩm
                        </button>

                        {/* Comment Form */}
                        {commentFormVisible[product.product_id] && (
                            <form onSubmit={(e) => handleCommentSubmit(e, product.product_id)} className="mt-4">
                                <textarea
                                    name="comment"
                                    className="w-full p-2 border rounded"
                                    placeholder="Nhập bình luận của bạn..."
                                    required
                                ></textarea>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    className="mt-2"
                                />
                                <button
                                    type="submit"
                                    className="mt-2 bg-green-500 text-white py-1 px-4 rounded"
                                >
                                    Gửi bình luận
                                </button>
                            </form>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrderHistory;

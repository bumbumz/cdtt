import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { incementQuantity, decrementQuantity } from '../redux/CartReducer';
import { GoHistory } from "react-icons/go";
const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart.cart);
    const [data, setData] = useState(cart);

    useEffect(() => {
        setData(cart);
    }, [cart]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const goToOrderPage = () => {
        navigate('/OderDetail');
    };
    const goToOrderHistoryPage = () => {
        navigate('/orderhistory');
    };


    // Calculate total amount
    const totalAmount = data.reduce((sum, item) => sum + item.pricebuy * item.quantity, 0);

    return (
        <div>
            <button
                className="top-4 right-4 text-black py-2 px-4"
                onClick={toggleSidebar}
            >
                Cart
            </button>
            <div
                className={`fixed top-0 right-0 h-full w-96 bg-white text-white transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <button
                    className="absolute top-4 right-4 text-black text-4xl hover:scale-110"
                    onClick={toggleSidebar}
                >
                    &times;
                </button>
                <div className="p-6">
                    <h2 className="text-lg text-black mb-4">Giỏ Hàng</h2>

                    <ul>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <li key={item.id} className="flex items-center mb-4 border-b pb-2">
                                    <img
                                        className="w-16 "
                                        src={item.thumbnail}
                                        alt={item.name}
                                    />
                                    <div className="text-black flex-grow">
                                        <div>{item.name}</div>
                                        <div>Số lượng: {item.quantity}</div>
                                        <div>Ngày thêm: {new Date(item.created_at).toLocaleDateString()}</div>
                                        <div>Giá: {item.pricebuy} VNĐ</div>
                                        <div>Tổng: {item.pricebuy * item.quantity} VNĐ</div>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => dispatch(decrementQuantity({ id: item.id }))}
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                        >
                                            -
                                        </button>
                                        <button
                                            onClick={() => dispatch(incementQuantity({ id: item.id, qty: item.quantity }))}
                                            className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                                        >
                                            +
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className="text-black">Giỏ hàng trống.</p>
                        )}
                    </ul>

                    {/* Display total amount */}
                    <h2 className="text-lg text-black mb-4">Tổng cộng: {totalAmount.toLocaleString()} VNĐ</h2>

                    <button
                        onClick={goToOrderPage}
                        className="mt-4 bg-blue-500  justify-center text-white py-2 px-4 rounded"
                    >
                        Chuyển đến trang Order
                    </button>


                    <button
                        onClick={goToOrderHistoryPage}
                        className="ml-9  justify-center text-black text-2xl"
                    >
                        <GoHistory className="mr-2" />
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Sidebar;

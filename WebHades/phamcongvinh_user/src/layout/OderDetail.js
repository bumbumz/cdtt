import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { incementQuantity, decrementQuantity, cleanCart } from '../redux/CartReducer';
import { UserService, OrderService } from '../Api';
import axios from 'axios';

function OrderDetail() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const [data, setData] = useState(cart);
  const [user, setUser] = useState({});
  const [editableAddress, setEditableAddress] = useState('');
  const [selectedItems, setSelectedItems] = useState({}); // Trạng thái cho sản phẩm đã chọn

  useEffect(() => {
    setData(cart);
  }, [cart]);

  // Tính tổng giá trị trong giỏ hàng
  const calculateTotal = () => {
    return data.reduce((total, item) => total + item.pricebuy * item.quantity, 0);
  };

  const fetchUser = async () => {
    const id = localStorage.getItem('userId');
    try {
      const response = await UserService.getId(id);
      const userData = response.user[0];
      setUser(userData);
      setEditableAddress(userData.address);
    } catch (err) {
      console.error("Error fetching User:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Xử lý thay đổi địa chỉ
  const handleAddressChange = (e) => {
    setEditableAddress(e.target.value);
  };

  // Lưu địa chỉ mới
  const saveAddress = async () => {
    try {
      const updatedUser = { ...user, address: editableAddress };
      setUser(updatedUser);
      await UserService.updateUser(user.id, updatedUser);
      alert("Địa chỉ giao hàng đã được cập nhật thành công!");
    } catch (err) {
      console.error("Error updating address:", err);
    }
  };

  // Xử lý chọn sản phẩm
  const handleSelectItem = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id], // Chuyển đổi trạng thái chọn
    }));
  };

  // Xử lý gửi đơn hàng
  const handleOrderSubmit = async () => {
    const selectedProducts = data.filter(item => selectedItems[item.id]); // Lọc sản phẩm đã chọn
    const orderData = {
      user_id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: editableAddress,
      products: selectedProducts.map(item => ({
        product_id: item.id,
        qty: item.quantity
      }))
    };

    try {
      await OrderService.createOrder(orderData);
      alert('Đơn hàng đã được tạo thành công!');
      dispatch(cleanCart());
      // Xử lý thêm nếu cần
    } catch (error) {
      console.error("Error placing order:", error);
      alert('Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.');
    }
  };
  console.log("dữ liệu trong cart", data)

  return (
    <div>
      <section className="bg-white py-16">
        <div className="flex flex-row container mx-auto px-4">
          <div className="flex flex-wrap w-1/2 lg:flex-nowrap gap-8 mb-8">
            <div className="border p-4 rounded-lg w-full lg:w-1/3">
              <h2 className="text-lg font-semibold mb-4">Thông Tin Người Dùng</h2>

              <div className="mb-2">
                <label className="block font-medium">Họ và Tên:</label>
                <input
                  type="text"
                  className="border rounded w-full p-2"
                  value={user.name || ''}
                  placeholder="Nhập họ tên"
                  readOnly
                />
              </div>
              <div className="mb-2">
                <label className="block font-medium">Email:</label>
                <input
                  type="email"
                  className="border rounded w-full p-2"
                  value={user.email || ''}
                  placeholder="Nhập email"
                  readOnly
                />
              </div>
              <div className="mb-2">
                <label className="block font-medium">Số điện thoại:</label>
                <input
                  type="tel"
                  className="border rounded w-full p-2"
                  value={user.phone || ''}
                  placeholder="Nhập số điện thoại"
                  readOnly
                />
              </div>
              <div className="mb-2">
                <label className="block font-medium">Địa chỉ giao hàng:</label>
                <textarea
                  className="border rounded w-full p-2"
                  value={editableAddress}
                  placeholder="Nhập địa chỉ giao hàng"
                  rows="3"
                  onChange={handleAddressChange}
                ></textarea>
                <button
                  onClick={saveAddress}
                  className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-600 transition ease-in-out duration-200"
                >
                  Lưu địa chỉ
                </button>
              </div>
            </div>
          </div>
          <div className="w-1/2 lg:w-2/3 bg-white shadow-md rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Giỏ Hàng</h1>
            <ul className="divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((item) => (
                  <li key={item.id} className="flex items-start py-4">
                    <img
                      className="w-20"
                      src={item.thumbnail}
                      alt={item.name}
                    />
                    <div className="text-black flex-grow">
                      <div className="font-bold text-lg">{item.name}</div>
                      <div className="text-gray-600">Số lượng: {item.quantity}</div>
                      <div className="text-gray-600">Ngày thêm: {new Date(item.created_at).toLocaleDateString()}</div>
                      {/* If there is a sale price, show original price with a strikethrough and display sale price */}
                      {item.pricesale !== 0 ? (
                        <div>
                          <span className="line-through text-red-500 mr-2">
                            {item.pricebuy.toLocaleString()} VNĐ
                          </span>
                          <span>{(item.pricebuy - item.pricesale).toLocaleString()} VNĐ</span>
                        </div>
                      ) : (
                        <div>{item.pricebuy.toLocaleString()} VNĐ</div>
                      )}
                      {/* Calculate the total based on the sale price if present */}
                      <div className="font-semibold text-lg mt-1">
                        Tổng: {(item.quantity * (item.pricesale !== 0 ? (item.pricebuy - item.pricesale) : item.pricebuy)).toLocaleString()} VNĐ
                      </div>
                      <label className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          checked={!!selectedItems[item.id]}
                          onChange={() => handleSelectItem(item.id)}
                          className="mr-2"
                        />
                        Chọn
                      </label>
                    </div>
                    <div className="flex items-center ml-4">
                      <button
                        onClick={() => dispatch(decrementQuantity({ id: item.id }))} // decrease quantity
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition ease-in-out duration-200"
                      >
                        -
                      </button>
                      <button
                        onClick={() => dispatch(incementQuantity({ id: item.id, qty: item.quantity }))} // increase quantity
                        className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition ease-in-out duration-200 ml-2"
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-black text-center">Giỏ hàng trống.</p>
              )}
            </ul>

            {data.length > 0 && (
              <h2 className="text-xl text-black font-semibold mt-6 text-right">
                Tổng cộng: {calculateTotal().toLocaleString()} VNĐ
              </h2>
            )}

            {data.length > 0 && (
              <button
                onClick={handleOrderSubmit}
                className="bg-green-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-green-600 transition ease-in-out duration-200"
              >
                Đặt hàng
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrderDetail;

import React from 'react';
import { useSelector } from 'react-redux';

function CartList() {
  const cart = useSelector((state) => state.cart.cart);

  console.log("Giỏ hàng:", cart);

  return (
    <div>
      {/* Bạn có thể hiển thị dữ liệu ở đây nếu muốn */}
      {cart.length === 0 ? (
        <p>Giỏ hàng của bạn trống!</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} - Số lượng: {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CartList;

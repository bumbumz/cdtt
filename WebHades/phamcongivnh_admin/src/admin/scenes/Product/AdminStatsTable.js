import React from 'react';

export default function AdminStatsTable() {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Bảng Thống Kê</h2>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Thống Kê</th>
                        <th className="py-2 px-4 border-b">Giá Trị</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="py-2 px-4 border-b">Sản phẩm</td>
                        <td className="py-2 px-4 border-b">500</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b">Người dùng</td>
                        <td className="py-2 px-4 border-b">2000</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b">Đơn hàng</td>
                        <td className="py-2 px-4 border-b">1500</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b">Doanh thu</td>
                        <td className="py-2 px-4 border-b">100.000.000đ</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

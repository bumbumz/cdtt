import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosList } from 'react-icons/io';

export default function Menu() {
    // Dữ liệu cứng cho logo và tên ứng dụng
    const data = {
        logoSrc: 'https://theme.hstatic.net/1000306633/1001194548/14/logo.png?v=231', // Đường dẫn đến logo
        appName: 'HADES' // Tên ứng dụng
    };

    // Dữ liệu cứng cho menu
    const menuItems = [
        {
            title: 'Category',
            icon: <IoIosList />, // Thay bằng biểu tượng mới
            links: [
                { to: '/admin/category', text: 'Category Table', icon: 'far fa-circle' },
            ]
        },
        {
            title: 'Sản phẩm',
            icon: <IoIosList />, // Thay bằng biểu tượng mới
            links: [
                { to: '/admin/product', text: 'Product Table', icon: 'far fa-circle' },
                { to: '/admin/productsale', text: 'Product Sale', icon: 'far fa-circle' },
                { to: '/admin/productstore', text: 'Product Store', icon: 'far fa-circle' },
            ]
        },
        {
            title: 'Banner',
            icon: <IoIosList />, // Thay bằng biểu tượng mới
            links: [
                { to: '/admin/banner', text: 'Banner', icon: 'far fa-circle' },
            ]
        },
        {
            title: 'Brand',
            icon: <IoIosList />, // Thay bằng biểu tượng mới
            links: [
                { to: '/admin/brand', text: 'Brand Table', icon: 'far fa-circle' },
            ]
        },
        {
            title: 'User',
            icon: <IoIosList />, // Thay bằng biểu tượng mới
            links: [
                { to: '/admin/user', text: 'Admin Users', icon: 'far fa-circle' },
            ]
        },
        {
            title: 'Order',
            icon: <IoIosList />, // Thay bằng biểu tượng mới
            links: [
                { to: '/admin/order', text: 'OrderDetail', icon: 'far fa-circle' },
            ]
        },
        {
            title: 'Config',
            icon: <IoIosList />, // Thay bằng biểu tượng mới
            links: [
                { to: '/admin/config', text: 'Config', icon: 'far fa-circle' },
            ]
        },
        {
            title: 'Post',
            icon: <IoIosList />, // Thay bằng biểu tượng mới
            links: [
                { to: '/admin/posthome', text: 'Post Home', icon: 'far fa-circle' },
            ]
        },
        {
            title: 'StoreLocations',
            icon: <IoIosList />, // Thay bằng biểu tượng mới
            links: [
                { to: '/admin/storelocation', text: 'Store Locations', icon: 'far fa-circle' },
            ]
        },
        {
            title: 'Contactinfo',
            icon: <IoIosList />, // Thay bằng biểu tượng mới
            links: [
                { to: '/admin/contactinfo', text: 'Contactinfo', icon: 'far fa-circle' },
            ]
        },
        {
            title: 'Menu',
            icon: <IoIosList />, // Thay bằng biểu tượng mới
            links: [
                { to: '/admin/menu', text: 'Menu', icon: 'far fa-circle' },
            ]
        },
        {
            title: 'Contact',
            icon: <IoIosList />, // Thay bằng biểu tượng mới
            links: [
                { to: '/admin/contact', text: 'Contact', icon: 'far fa-circle' },
            ]
        },





    ];

    // State để quản lý menu đang mở
    const [openMenu, setOpenMenu] = useState(null);

    // Hàm để xử lý việc mở và đóng menu
    const handleMenuClick = (index) => {
        setOpenMenu(openMenu === index ? null : index);
    };

    return (
        <aside className="w-64 bg-white h-full">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center p-4">
                <img src={data.logoSrc} alt={`${data.appName} Logo`} className="h-full w-full mr-2 rounded-full opacity-80" />
            </Link>
            {/* Sidebar */}
            <div className="overflow-y-auto">
                <nav className="mt-2">
                    <ul className="space-y-2">
                        {menuItems.map((item, index) => (
                            <li key={index} className="group">
                                <button
                                    onClick={() => handleMenuClick(index)}
                                    className="flex items-center p-2 text-black hover:bg-gray-700 hover:text-white rounded w-full text-left"
                                >
                                    <span className="mr-2">{item.icon}</span> {/* Hiển thị biểu tượng */}
                                    <span>{item.title}</span>
                                    <i
                                        className={`fas fa-angle-left ml-auto transition-transform ${openMenu === index ? 'rotate-90' : ''}`}
                                    />
                                </button>
                                <ul className={`ml-4 mt-1 space-y-1 ${openMenu === index ? 'block' : 'hidden'}`}>
                                    {item.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>

                                            <Link
                                                to={link.to}
                                                className="flex items-center p-2 text-black hover:bg-gray-700 hover:text-white rounded"
                                            >
                                                <i className={`${link.icon} mr-2`} />
                                                <span>{link.text}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}

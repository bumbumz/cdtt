import React, { useEffect, useState } from 'react';
import { FiMenu, FiSearch, FiSun, FiBell, FiMessageSquare, FiDollarSign, FiLogOut } from 'react-icons/fi';
import axios from 'axios';

const Header = () => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Fetch user info from the API
    const getUserInfo = async () => {
        const token = localStorage.getItem('authToken');
        const id = localStorage.getItem('userId');
        if (!token) {
            console.log('No token found');
            return;
        }

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/user/show/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser(response.data.user); // Update user info
        } catch (error) {
            console.error('Error fetching user info:', error);
            if (error.response && error.response.status === 401) {
                handleLogout();
            }
        }
    };
    console.log("hình nền", user)

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        window.location.reload();
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    // Toggle profile and notification menus
    const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
    const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);

    return (
        <header className="z-10 py-1 bg-white shadow-md dark:bg-gray-800">
            <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
                {/* Mobile hamburger */}
                <button className="p-2 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple" aria-label="Menu">
                    <FiMenu className="w-6 h-6" />
                </button>
                {/* Search input */}
                <div className="flex flex-1 justify-center lg:mr-32">
                    <div className="relative w-full max-w-lg">
                        <input className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border rounded-md dark:placeholder-gray-500 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:shadow-outline-purple" type="text" placeholder="Search for projects" aria-label="Search" />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FiSearch className="w-4 h-4 text-gray-500" />
                        </div>
                    </div>
                </div>
                <ul className="flex items-center space-x-6">
                    {/* Theme toggler */}
                    <li>
                        <button className="p-2 rounded-md focus:outline-none focus:shadow-outline-purple" aria-label="Toggle color mode">
                            <FiSun className="w-5 h-5" />
                        </button>
                    </li>
                    {/* Notifications menu */}
                    <li className="relative">
                        <button className="p-2 rounded-md focus:outline-none focus:shadow-outline-purple" aria-label="Notifications" aria-haspopup="true" onClick={toggleNotifications}>
                            <FiBell className="w-5 h-5" />
                            <span aria-hidden="true" className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"></span>
                        </button>
                        {isNotificationsOpen && (
                            <ul className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700" aria-label="submenu">
                                <li className="flex">
                                    <a className="flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">
                                        <span>Messages</span>
                                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600">13</span>
                                        <FiMessageSquare />
                                    </a>
                                </li>
                                <li className="flex">
                                    <a className="flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">
                                        <span>Sales</span>
                                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600">2</span>
                                        <FiDollarSign />
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>
                    {/* Profile menu */}
                    <li className="relative">
                        {user ? (

                            <button className="p-1 rounded-full focus:shadow-outline-purple focus:outline-none" aria-label="Account" aria-haspopup="true" onClick={toggleProfileMenu}>
                                <img src={user[0].thumbnail} className="object-cover w-8 h-8 rounded-full" alt="Profile" />
                            </button>
                        ) : (
                            <button className="p-1 rounded-full focus:shadow-outline-purple focus:outline-none" aria-label="Login" onClick={() => (window.location.href = '/login')}>
                                Login

                            </button>
                        )}
                        {isProfileMenuOpen && user && (
                            <ul className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700" aria-label="submenu">
                                <li className="flex">
                                    <a className="flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">
                                        <span>Account settings</span>
                                    </a>
                                </li>
                                <li className="flex">
                                    <button onClick={handleLogout} className="flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                                        <span>Logout</span>
                                        <FiLogOut />
                                    </button>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;

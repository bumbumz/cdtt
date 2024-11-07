import React from 'react';
import { Link } from 'react-router-dom';

export default function TopNav() {
    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">

            {/* Right navbar links */}
            <ul className="flex items-center space-x-4">
                {/* Navbar Search */}
                <li className="relative">
                    <a className="text-gray-500 hover:text-gray-700 cursor-pointer">
                        <i className="fas fa-search" />
                    </a>
                    <div className="absolute hidden mt-2 right-0 bg-white border border-gray-200 rounded shadow-lg">
                        <form className="flex">
                            <input className="form-input w-full px-2 py-1 border border-gray-300 rounded-l-md focus:outline-none" type="search" placeholder="Search" aria-label="Search" />
                            <button className="px-3 py-1 bg-gray-100 border-l border-gray-300 rounded-r-md">
                                <i className="fas fa-search" />
                            </button>
                        </form>
                    </div>
                </li>
                {/* Messages Dropdown Menu */}
                <li className="relative">
                    <a className="text-gray-500 hover:text-gray-700 cursor-pointer">
                        <i className="far fa-comments" />
                        <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-600 rounded-full"></span>
                    </a>
                    <div className="absolute hidden mt-2 right-0 w-64 bg-white border border-gray-200 rounded shadow-lg">
                        {/* Message item */}
                        <a href="#st" className="flex items-center p-2 hover:bg-gray-100">
                            <img src="dist/img/user1-128x128.jpg" alt="User Avatar" className="h-10 w-10 rounded-full mr-2" />
                            <div>
                                <h3 className="text-sm font-medium">Brad Diesel</h3>
                                <p className="text-xs text-gray-500">Call me whenever you can...</p>
                                <p className="text-xs text-gray-400">4 Hours Ago</p>
                            </div>
                        </a>
                        <div className="border-t border-gray-200"></div>
                        {/* Add more messages as needed */}
                        <a href="#st" className="block p-2 text-sm text-center text-gray-500 hover:bg-gray-100">See All Messages</a>
                    </div>
                </li>
                {/* Notifications Dropdown Menu */}
                <li className="relative">
                    <a className="text-gray-500 hover:text-gray-700 cursor-pointer">
                        <i className="far fa-bell" />
                        <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
                    </a>
                    <div className="absolute hidden mt-2 right-0 w-64 bg-white border border-gray-200 rounded shadow-lg">
                        <span className="block p-2 text-center text-gray-700">15 Notifications</span>
                        <div className="border-t border-gray-200"></div>
                        {/* Notification item */}
                        <a href="#st" className="flex items-center p-2 hover:bg-gray-100">
                            <i className="fas fa-envelope mr-2 text-gray-500" /> 4 new messages
                            <span className="ml-auto text-xs text-gray-400">3 mins</span>
                        </a>
                        {/* Add more notifications as needed */}
                        <div className="border-t border-gray-200"></div>
                        <a href="#st" className="block p-2 text-sm text-center text-gray-500 hover:bg-gray-100">See All Notifications</a>
                    </div>
                </li>
                {/* Fullscreen */}
                <li>
                    <a className="text-gray-500 hover:text-gray-700 cursor-pointer">
                        <i className="fas fa-expand-arrows-alt" />
                    </a>
                </li>
                {/* Control Sidebar */}
                <li>
                    <a className="text-gray-500 hover:text-gray-700 cursor-pointer">
                        <i className="fas fa-th-large" />
                    </a>
                </li>
            </ul>
        </nav>
    )
}

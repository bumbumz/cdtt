import React, { useEffect, useState } from 'react';
import { MenuService } from '../../../Api';
import { Link } from 'react-router-dom';
import { BsTrash2 } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import Switch from "react-switch";

function MenuUsser() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await MenuService.getList();
        if (response && response.menu) {
          setMenus(response.menu); // Lưu danh sách menu từ API
        } else {
          console.error("Unexpected response format:", response);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching menus:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 2 : 1; // Toggle status between 1 and 2
    try {
      // Assuming toggleStatus only needs the ID and status change
      await MenuService.toggleStatus(id, { status: newStatus });

      // Update the status locally after API call
      setMenus(menus.map(menu =>
        menu.id === id ? { ...menu, status: newStatus } : menu
      ));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteMenu = async (id) => {
    try {
      // Assuming there is a deleteMenu function in MenuService
      await MenuService.deleteMenu(id);
      setMenus(menus.filter(menu => menu.id !== id)); // Remove from local state
    } catch (err) {
      console.error("Error deleting menu:", err);
    }
  };

  if (loading) return <div>Loading menus...</div>;
  if (error) return <div>Error loading menus!</div>;

  return (
    <div className="p-4 space-x-2">
      <h1 className="text-2xl font-semibold mb-6 text-white">Quản lý Menu</h1>
      <Link
        to="/admin/menu/add"
        className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
      >
        <IoMdAddCircleOutline />
      </Link>
      <Link
        to="/admin/menu/trash"
        className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
      >
        <BsTrash2 />
      </Link>

      <table className="min-w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="border border-gray-400 p-2">ID</th>
            <th className="border border-gray-400 p-2">Tên Menu</th>
            <th className="border border-gray-400 p-2">Liên Kết</th>
            <th className="border border-gray-400 p-2">Loại</th>
            <th className="border border-gray-400 p-2">Trạng Thái</th>
            <th className="border border-gray-400 p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu.id} className="hover:bg-gray-700 text-white">
              <td className="border border-gray-400 p-2">{menu.id}</td>
              <td className="border border-gray-400 p-2">{menu.name}</td>
              <td className="border border-gray-400 p-2">{menu.link}</td>
              <td className="border border-gray-400 p-2">{menu.type}</td>
              <td className="border border-gray-400 p-2">
                <Switch
                  onChange={() => handleStatusChange(menu.id, menu.status)}
                  checked={menu.status === 1} // Status 1 = checked (on), 2 = unchecked (off)
                  onColor="#4CAF50"
                  offColor="#FF4136"
                />
              </td>
              <td className="border-t border-gray-400 p-2 flex space-x-2 items-start justify-center">
                <Link
                  to={`/admin/menu/edit/${menu.id}`}
                  className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition inline-flex items-center"
                >
                  <FaEdit />
                </Link>
                <button
                  onClick={() => handleDeleteMenu(menu.id)}
                  className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition inline-flex items-center"
                >
                  <RiDeleteBin5Line />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MenuUsser;

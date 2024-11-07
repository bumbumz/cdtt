import React, { useEffect, useState } from 'react';
import { ContactService } from '../../../Api';
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IoMdAddCircleOutline } from "react-icons/io";

function Contac() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await ContactService.getList();
                if (response && response.contact) {
                    setContacts(response.contact); // Store contact data
                } else {
                    console.error("Unexpected response format:", response);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching contacts:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    if (loading) return <div>Loading contacts...</div>;
    if (error) return <div>Error loading contacts!</div>;

    return (
        <div className="p-4 space-x-2">
            <h1 className="text-2xl font-semibold mb-6 text-white">Quản lý Liên hệ</h1>
            <Link
                to="/admin/contact/add"
                className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition mb-6 inline-block"
            >
                <IoMdAddCircleOutline />
            </Link>

            <table className="min-w-full border-collapse border border-gray-400">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="border border-gray-400 p-2">ID</th>
                        <th className="border border-gray-400 p-2">Tên</th>
                        <th className="border border-gray-400 p-2">Email</th>
                        <th className="border border-gray-400 p-2">Số điện thoại</th>
                        <th className="border border-gray-400 p-2">Tiêu đề</th>
                        <th className="border border-gray-400 p-2">Nội dung</th>
                        <th className="border border-gray-400 p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-gray-700 text-white">
                            <td className="border border-gray-400 p-2">{contact.id}</td>
                            <td className="border border-gray-400 p-2">{contact.name}</td>
                            <td className="border border-gray-400 p-2">{contact.email}</td>
                            <td className="border border-gray-400 p-2">{contact.phone}</td>
                            <td className="border border-gray-400 p-2">{contact.title}</td>
                            <td className="border border-gray-400 p-2">{contact.content}</td>
                            <td className="border border-gray-400 p-2 flex space-x-2 items-start justify-center">
                                <Link
                                    to={`/admin/contact/edit/${contact.id}`}
                                    className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition inline-flex items-center"
                                >
                                    <FaEdit />
                                </Link>
                                <button
                                    // Uncomment and add delete function if needed
                                    // onClick={() => handleDeleteContact(contact.id)}
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

export default Contac;

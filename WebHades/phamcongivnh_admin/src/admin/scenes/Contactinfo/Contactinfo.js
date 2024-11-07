import React, { useEffect, useState } from 'react';
import { ContactinfoService } from '../../../Api';
import { Link } from 'react-router-dom';
import { BsTrash2 } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

function Contactinfo() {
    const [contactInfo, setContactInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await ContactinfoService.getList();
                if (response && response.contactinfo) {
                    setContactInfo(response.contactinfo);
                } else {
                    console.error("Unexpected response format:", response);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching contact info:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchContactInfo();
    }, []);

    if (loading) return <div>Loading contact information...</div>;
    if (error) return <div>Error loading contact information!</div>;

    return (
        <div className="p-4 space-x-2">
            <h1 className="text-2xl font-semibold mb-6 text-white">Quản lý Thông Tin Liên Hệ</h1>


            <table className="min-w-full border-collapse border border-gray-400">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="border border-gray-400 p-2">ID</th>
                        <th className="border border-gray-400 p-2">Nhãn</th>
                        <th className="border border-gray-400 p-2">Giá Trị</th>
                        <th className="border border-gray-400 p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {contactInfo.map((info) => (
                        <tr key={info.id} className="hover:bg-gray-700 text-white">
                            <td className="border border-gray-400 p-2">{info.id}</td>
                            <td className="border border-gray-400 p-2">{info.label}</td>
                            <td className="border border-gray-400 p-2">{info.value}</td>
                            <td className="border-t border-gray-400 p-2 flex space-x-2 items-center justify-center">
                                <Link
                                    to={`/admin/contactinfo/edit/${info.id}`}
                                    className="text-black bg-slate-400 px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black transition inline-flex items-center"
                                >
                                    <FaEdit /> Sửa
                                </Link>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Contactinfo;

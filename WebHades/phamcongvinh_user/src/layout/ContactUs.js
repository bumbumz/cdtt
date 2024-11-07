import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        title: '',
        content: '',
        status: 1,
    });
    const [user, setUser] = useState(null);

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
            const userData = response.data.user[0];
            setUser(userData);
            setFormData((prevData) => ({
                ...prevData,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
            }));
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/contact/store', formData);
            toast.success('Form submitted successfully!');
            console.log(response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit form');
        }
    };

    return (
        <div className="container mx-auto p-8">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-8">Liên Hệ Với Chúng Tôi</h1>
            <div className="flex justify-between">
                <div className="w-1/2 pr-4">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0265503276436!2d106.62968131533442!3d10.779896561429355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752c7fc7aa7c41%3A0x49f06954bc4dc3b7!2sBitexco%20Financial%20Tower!5e0!3m2!1sen!2svi!4v1633022820000!5m2!1sen!2svi"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        title="Google Map of Bitexco Tower"
                    ></iframe>
                </div>
                <div className="w-1/2 pl-4">
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                        <div>
                            <input
                                type="text"
                                placeholder="Tên"
                                className="w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-pink-500"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-pink-500"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Số điện thoại"
                                className="w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-pink-500"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Tiêu đề"
                                className="w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-pink-500"
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Nội dung"
                                className="w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-pink-500"
                                rows="4"
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            ></textarea>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full p-3 bg-white border border-black text-black font-bold rounded-lg flex items-center justify-center hover:bg-black hover:text-white transition duration-300"
                            >
                                <FaPaperPlane className="mr-2" />
                                GỬI
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-semibold">Địa Chỉ</h2>
                <p>
                    26 LY TU TRONG STREET, DISTRICT 1, HOCHIMINH (THE NEW PLAYGROUND)
                </p>
            </div>
        </div>
    );
};

export default ContactUs;

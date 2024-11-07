import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContactinfoService } from '../../../Api';

function EditContactinfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contactInfo, setContactInfo] = useState({ label: '', value: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch contact info based on ID
        const fetchContactInfo = async () => {
            try {
                const response = await ContactinfoService.getId(id);
                if (response && response.contactinfo) {
                    setContactInfo({
                        label: response.contactinfo.label,
                        value: response.contactinfo.value
                    });
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
    }, [id]);

    const handleChange = (e) => {
        setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ContactinfoService.update(id, contactInfo);
            alert("Contact info updated successfully");
            navigate('/admin/contactinfo');
        } catch (err) {
            console.error("Error updating contact info:", err);
            setError(err);
        }
    };

    if (loading) return <div>Loading contact info...</div>;
    if (error) return <div>Error loading contact info!</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Edit Contact Info</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="label" className="block font-medium mb-2">Label</label>
                    <input
                        type="text"
                        id="label"
                        name="label"
                        value={contactInfo.label}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="value" className="block font-medium mb-2">Value</label>
                    <input
                        type="text"
                        id="value"
                        name="value"
                        value={contactInfo.value}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default EditContactinfo;

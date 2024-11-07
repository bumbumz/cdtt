import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreLocationsService } from '../../../Api';

function EditStoreLocation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [storeLocation, setStoreLocation] = useState({ text: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch store location data based on ID
        const fetchStoreLocation = async () => {
            try {
                const response = await StoreLocationsService.getId(id);
                if (response && response.text) {
                    setStoreLocation({ text: response.text });
                } else {
                    console.error("Unexpected response format:", response);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching store location:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchStoreLocation();
    }, [id]);

    const handleChange = (e) => {
        setStoreLocation({ ...storeLocation, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await StoreLocationsService.update(id, { text: storeLocation.text });
            alert("Store location updated successfully");
            navigate('/admin/storelocation');
        } catch (err) {
            console.error("Error updating store location:", err);
            setError(err);
        }
    };

    if (loading) return <div>Loading store location...</div>;
    if (error) return <div>Error loading store location!</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Edit Store Location</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="text" className="block font-medium mb-2">Store Location Text</label>
                    <input
                        type="text"
                        id="text"
                        name="text"
                        value={storeLocation.text}
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

export default EditStoreLocation;

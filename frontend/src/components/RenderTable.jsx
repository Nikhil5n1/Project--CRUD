/* RAW */
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function RenderTable({ name }) {
    const [attributes, setAttributes] = useState([]);
    const [updatedValue, setUpdatedValue] = useState("");

    useEffect(() => {
        if (name) {
            axios.get(`/api/columnsAndValues/${name}`)
                .then(res => setAttributes(res.data.map(attr => ({ ...attr }))))
                .catch(err => console.error(`Failed to fetch attributes for ${name}:`, err));
        }
    }, [name]); // Dependency on `name` to refetch when it changes

    const handleUpdate = async (attributeName, index) => {
        try {
            console.log("you've clicked to update")
            await axios.put(`/api/updateValue/${name}`, { attributeName, updatedValue, index: index+1 });
        }
        catch(error) {
            console.error(`Error occurred while updating value ${updatedValue}:`, error.message);
        }
    };

    const handleDelete = async (index) => {
        try {
            console.log("you've clicked to delete");
            await axios.put(`/api/deleteValue/${name}`, { index: index+1 });
        }
        catch(error) {
            console.error(`Error occurred while deleting value ${updatedValue}:`, error.message);
        }
    };

    return (
        <div className="flex gap-10">
            {attributes.map((attribute, index) => (
                <div key={attribute.COLUMN_NAME} className="bg-gray-100 p-4 rounded">
                    <h2 className="text-lg font-bold mb-2">{attribute.COLUMN_NAME}</h2>
                    {attribute.values.map((val, index) => (
                        <div key={val} className="flex items-center space-x-4">
                            <input
                                type="text"
                                placeholder={attribute.values[index]} // Bind value to attribute.values[index]
                                onChange={(e) => {
                                    setUpdatedValue(e.target.value);
                                }}
                                className="w-64 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={() => handleUpdate(attribute.COLUMN_NAME, index)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(index)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
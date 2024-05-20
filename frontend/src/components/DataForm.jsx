import axios from 'axios';
import React, { useState, useEffect } from 'react';

const DataForm = () => {
  const [entityName, setEntityName] = useState('');
  const [entityAttributes, setEntityAttributes] = useState([{}]);
  const [formData, setFormData] = useState({});
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    axios.get(`/api/columnsAndValues/${entityName}`)
    .then(res => setEntityAttributes(res.data));
  }, [entityName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/data/${entityName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setResponseMessage(result.message);
      } else {
        const errorResult = await response.json();
        setResponseMessage(errorResult.error);
      }
    } catch (error) {
      setResponseMessage('Failed to create data');
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-800 to-black min-h-screen flex justify-center items-center">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-white">Adding Values to Table</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="mb-4">
            <label className="block mb-2 text-white">Entity Name:</label>
            <input
              type="text"
              value={entityName}
              onChange={(e) => {
                  setEntityName(e.target.value)
              }}
              required
              className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-white">Data:</label>
            {entityAttributes.slice(1).map((entityAttribute) => (
              <input
                key={entityAttribute.COLUMN_NAME}
                type="text"
                name={entityAttribute.COLUMN_NAME}
                onChange={handleInputChange}
                placeholder={entityAttribute.COLUMN_NAME}
                className="block w-full px-4 py-2 rounded-lg border border-gray-300 mb-2 focus:outline-none focus:border-blue-500"
              />
            ))}
          </div>
          <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">Submit</button>
        </form>
        {responseMessage && <p className="mt-4 text-red-500">{responseMessage}</p>}
      </div>
    </div>
  );
};

export default DataForm;

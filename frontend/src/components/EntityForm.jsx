import { useState } from 'react';

const EntityForm = () => {
  const [entityName, setEntityName] = useState('');
  const [attributes, setAttributes] = useState([{ name: '', type: '' }]);
  const [message, setMessage] = useState('');

  const handleAttributeChange = (index, key, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][key] = value;
    setAttributes(updatedAttributes);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: '', type: '' }]);
  };

  const createTable = async (entityName, attributes) => {
    try {
      const response = await fetch(`/api/createTable/${entityName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attributes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      alert('Table created successfully!');
      setMessage('');
    } catch (error) {
      console.error('Error creating table:', error.message);
      setMessage(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: entityName,
      attributes: attributes.filter(attr => attr.name && attr.type)
    };

    try {
      const response = await fetch('/api/entity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      await createTable(entityName, formData.attributes);
      setMessage('Entity and its table created successfully!');
    } catch (error) {
      console.error('Error creating entity:', error.message);
      setMessage(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-800 to-black">
      <div className="border border-gray-300 p-8 rounded-lg bg-white w-full max-w-md shadow-xl overflow-y-auto max-h-screen">
        <h2 className="text-center text-3xl font-bold mb-6 text-black">Create Table</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Entity Name:</label>
            <input
              type="text"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {attributes.map((attribute, index) => (
            <div key={index} className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Attribute Name:</label>
                <input
                  type="text"
                  value={attribute.name}
                  onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Attribute Type:</label>
                <select
                  value={attribute.type}
                  onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Type</option>
                  <option value="STRING">String</option>
                  <option value="INTEGER">Integer</option>
                  <option value="FLOAT">Float</option>
                  <option value="BOOLEAN">Boolean</option>
                  <option value="DATE">Date</option>
                </select>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addAttribute}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition duration-200"
          >
            Add Attribute
          </button>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition duration-200"
          >
            Create Table
          </button>
        </form>
        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default EntityForm;

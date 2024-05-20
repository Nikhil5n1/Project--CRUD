import { useEffect, useState } from 'react';
import axios from 'axios';
import RenderTable from './RenderTable';

export default function DisplayEntities() {
    const [entities, setEntities] = useState([]);
    const [entityName, setEntityName] = useState("");

    useEffect(() => {
        axios.get("/api/entities")
            .then(res => {
                setEntities(res.data);
            })
            .catch(err => console.error("Failed to fetch entities:", err));
    }, []);

    function handleClick(entityName) {
        return () => {
            console.log("You clicked on:", entityName);
            setEntityName(entityName);
        };
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-800 to-black">
            <div className="flex flex-col border border-gray-300 p-8 rounded-lg bg-white w-64 h-full max-h-screen overflow-y-auto">
                <h2 className="text-center text-2xl font-bold mb-4 text-black">Tables List</h2>
                <hr className="my-4 border border-gray-400" />
                {entities.map(entity => (
                    <div key={entity.id} className="mb-4">
                        <button onClick={handleClick(entity.name)} className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition duration-200">
                            {entity.name}
                        </button>
                    </div>
                ))}
            </div>
            <div className="border border-gray-300 p-8 rounded-lg bg-white w-full max-w-xl ml-8 overflow-y-auto">
                <h2 className="text-center text-2xl font-bold mb-4" style={{background: "linear-gradient(to right, red, blue)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
                    CRUD Operations
                </h2>
                <h2 className="text-center text-2xl font-bold mb-4 text-black">Content of Each Table</h2>
                <RenderTable name={entityName} />
            </div>
        </div>
    );
}

import { NavLink } from "react-router-dom";

export default function Header() {
    return (
        <div className="container mx-auto px-4 py-4 flex flex-col items-center bg-gradient-to-r from-blue-800 to-black bg-opacity-90">
            <h1 className="text-2xl font-bold mb-2 text-white">CRUD APP</h1>
            <div className="flex gap-6">
                <NavLink to="/entityForm" className="text-white hover:text-blue-500 transition duration-200">CreateTable</NavLink>
                <NavLink to="/dataForm" className="text-white hover:text-blue-500 transition duration-200">AddValues</NavLink>
                <NavLink to="/displayEntities" className="text-white hover:text-blue-500 transition duration-200">CRUD</NavLink>
            </div>
            <hr className="my-2 w-full border border-gray-300" />
        </div>
    );
}



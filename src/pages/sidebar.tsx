
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
      <ul>
        <li className="mb-4">
          <Link to="/user" className="text-white hover:bg-gray-600 p-2 rounded block">
            Users
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/carros" className="text-white hover:bg-gray-600 p-2 rounded block">
            Cars
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;


import { Route, Routes } from 'react-router-dom';
import Sidebar from './sidebar';
import Users from './users-admin';
import Cars from './cars-admin';

const Dashboard = () => {
  return (
    <div className="flex h-screen">
    
      <div className="w-64 bg-[#0022FF] text-white p-6">
        <Sidebar />
      </div>
     
      <div className="flex-1 bg-gray-50 p-8">
        <Routes>
          <Route path="users" element={<Users />} />
          <Route path="cars" element={<Cars />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;

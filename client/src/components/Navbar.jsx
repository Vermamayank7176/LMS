import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, LayoutDashboard, Library, FileText } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 text-white font-bold text-xl">
              <BookOpen size={24} />
              LMS
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="text-indigo-100 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium">
                <LayoutDashboard className="mr-1" size={18} /> Dashboard
              </Link>
              <Link to="/books" className="text-indigo-100 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium">
                <Library className="mr-1" size={18} /> Books
              </Link>
              {user?.role === 'admin' && (
                <Link to="/transactions" className="text-indigo-100 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium">
                  <FileText className="mr-1" size={18} /> Transactions
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-white mr-4 text-sm font-medium">Hi, {user?.name} ({user?.role})</span>
            <button
              onClick={handleLogout}
              className="text-indigo-100 hover:text-white p-2 rounded-md focus:outline-none flex items-center gap-1 text-sm"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

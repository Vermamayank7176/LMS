import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, LayoutDashboard, Library, FileText } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
          isActive 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
            : 'text-gray-600 hover:bg-white/80 hover:text-indigo-600'
        }`}
      >
        <Icon size={18} /> {children}
      </Link>
    );
  };

  return (
    <nav className="glass-nav rounded-2xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 text-indigo-700 font-extrabold text-2xl tracking-tight">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-md shadow-indigo-500/40">
              <BookOpen size={24} />
            </div>
            LMS
          </Link>
          
          <div className="hidden md:flex space-x-2 bg-gray-100/50 p-1.5 rounded-2xl border border-white/60">
            <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink to="/books" icon={Library}>Books</NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/transactions" icon={FileText}>Transactions</NavLink>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-gray-900 text-sm font-bold leading-tight">{user?.name}</span>
            <span className="text-indigo-600 text-xs font-semibold px-2 py-0.5 bg-indigo-50 rounded-full mt-0.5 border border-indigo-100">
              {user?.role.toUpperCase()}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-100/80 hover:bg-red-50 hover:text-red-600 text-gray-700 p-2 sm:px-4 sm:py-2 rounded-xl text-sm font-semibold transition-all duration-300 border border-gray-200/50 hover:border-red-200"
          >
            <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

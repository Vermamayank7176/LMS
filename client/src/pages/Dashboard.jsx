import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Users, Library, Activity, AlertCircle, BookOpen, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalBooks: 0, totalUsers: 0, issuedBooks: 0, totalFines: 0 });
  const [recentFines, setRecentFines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/reports/dashboard');
        setStats(data);
        
        const finesRes = await api.get('/reports/fines');
        // Only show last 5 fines
        setRecentFines(finesRes.data.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, colorClass, gradient }) => (
    <div className={`glass p-6 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-white/60`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-black mt-2 text-gray-800">{value}</h3>
        </div>
        <div className={`p-4 rounded-2xl text-white ${gradient} shadow-lg`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">System Overview</h1>
        {user?.role === 'admin' && (
          <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md uppercase tracking-wider">
            Admin View
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Library Books" 
          value={stats.totalBooks} 
          icon={Library}
          gradient="bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30"
        />
        <StatCard 
          title="Issued Books" 
          value={stats.issuedBooks} 
          icon={BookOpen}
          gradient="bg-gradient-to-br from-emerald-400 to-teal-500 shadow-teal-500/30"
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users}
          gradient="bg-gradient-to-br from-purple-500 to-fuchsia-500 shadow-purple-500/30"
        />
        <StatCard 
          title="Total Unpaid Fines" 
          value={`₹${stats.totalFines}`} 
          icon={AlertCircle}
          gradient="bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/30"
        />
      </div>

      {user?.role === 'admin' && (
        <div className="mt-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="text-indigo-600" /> Recent Fines Matrix
          </h2>
          <div className="glass rounded-3xl overflow-hidden shadow-xl border border-white/60">
            <table className="min-w-full divide-y divide-gray-200/50">
              <thead className="bg-gray-50/50 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">User Details</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Book Name</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Amount Due</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {recentFines.length > 0 ? (
                  recentFines.map((fine) => (
                    <tr key={fine._id} className="hover:bg-white/40 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{fine.user?.name}</div>
                        <div className="text-xs font-semibold text-gray-500">{fine.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-indigo-900">{fine.transaction?.book?.title || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-rose-600">₹{fine.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-4 py-1.5 inline-flex text-xs leading-5 font-black rounded-full shadow-sm ${
                          fine.status === 'paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {fine.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-sm font-semibold text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Clock size={32} className="text-indigo-300" />
                        No active fines to display right now.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

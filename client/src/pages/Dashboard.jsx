import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Users, Banknote, Bookmark } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [myTransactions, setMyTransactions] = useState([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchStats = async () => {
        try {
          const { data } = await api.get('/reports/dashboard');
          setStats(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchStats();
    } else {
      const fetchMyTransactions = async () => {
        try {
          const { data } = await api.get('/transactions/my');
          setMyTransactions(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchMyTransactions();
    }
  }, [user]);

  if (user?.role === 'admin') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<BookOpen />} title="Total Books" value={stats.totalBooks} color="bg-blue-500" />
            <StatCard icon={<Users />} title="Total Users" value={stats.totalUsers} color="bg-green-500" />
            <StatCard icon={<Bookmark />} title="Issued Books" value={stats.issuedBooks} color="bg-yellow-500" />
            <StatCard icon={<Banknote />} title="Outstanding Fines" value={`₹${stats.outstandingFines}`} color="bg-red-500" />
          </div>
        ) : (
          <div>Loading stats...</div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">My Books</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myTransactions.map(tx => (
                <tr key={tx._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.book?.title || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.issueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      tx.status === 'returned' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {myTransactions.length === 0 && (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No books issued.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden flex items-center p-6">
    <div className={`p-4 rounded-full text-white ${color}`}>
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;

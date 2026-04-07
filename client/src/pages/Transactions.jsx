import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { ArrowRightLeft, UserCheck, BookCopy, CalendarClock, CheckCircle2 } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  
  const [issueData, setIssueData] = useState({ user: '', book: '', dueDate: '' });

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
    fetchBooks();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/transactions');
      setTransactions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books');
      setBooks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions/issue', issueData);
      setIssueData({ user: '', book: '', dueDate: '' });
      fetchTransactions();
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error issuing book');
    }
  };

  const handleReturn = async (id) => {
    try {
      await api.post(`/transactions/return/${id}`);
      fetchTransactions();
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error returning book');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
           <ArrowRightLeft className="text-indigo-600" size={36}/> Manage Transactions
        </h1>
        <p className="text-gray-500 font-medium mt-1">Issue books, track active checkouts, and process returns.</p>
      </div>

      <div className="glass p-6 rounded-3xl shadow-xl border border-white/60">
        <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2 text-indigo-900 border-b border-indigo-100 pb-3">
          <BookCopy className="text-indigo-500" /> Issue a New Book
        </h2>
        <form onSubmit={handleIssue} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
              <UserCheck size={16} className="text-indigo-400"/> Select User
            </label>
            <select required className="glass-input w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium appearance-none"
                    value={issueData.user} onChange={e => setIssueData({...issueData, user: e.target.value})}>
              <option value="">-- Choose User --</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
              <BookCopy size={16} className="text-indigo-400"/> Select Book
            </label>
            <select required className="glass-input w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium appearance-none"
                    value={issueData.book} onChange={e => setIssueData({...issueData, book: e.target.value})}>
              <option value="">-- Choose Book --</option>
              {books.map(b => (
                <option key={b._id} value={b._id} disabled={b.availableCopies <= 0}>
                  {b.title} ({b.availableCopies} avail)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
              <CalendarClock size={16} className="text-indigo-400"/> Due Date
            </label>
            <input type="date" required className="glass-input w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                   value={issueData.dueDate} onChange={e => setIssueData({...issueData, dueDate: e.target.value})} />
          </div>
          <div>
            <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-4 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95">
              Issue Protocol
            </button>
          </div>
        </form>
      </div>

      <div className="glass shadow-2xl rounded-3xl overflow-hidden border border-white/60">
         <h2 className="text-xl font-extrabold p-6 bg-white/40 border-b border-indigo-100 flex items-center gap-2">
           <CheckCircle2 className="text-indigo-600" /> Active Registry
         </h2>
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/50">
              <thead className="bg-gray-50/50 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Patron</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Asset (Book)</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Chronology</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">State</th>
                  <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {transactions.map(tx => (
                  <tr key={tx._id} className="hover:bg-white/40 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{tx.user?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-indigo-900">{tx.book?.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5 text-xs font-semibold text-gray-600">
                        <span className="text-emerald-600">Issued: {new Date(tx.issueDate).toLocaleDateString()}</span>
                        <span className="text-rose-600">Due: {new Date(tx.dueDate).toLocaleDateString()}</span>
                        {tx.returnDate && <span className="text-indigo-600">Ret: {new Date(tx.returnDate).toLocaleDateString()}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-4 py-1.5 inline-flex text-xs leading-5 font-black rounded-full shadow-sm ${
                        tx.status === 'returned' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {tx.status === 'issued' ? (
                        <button onClick={() => handleReturn(tx._id)} className="text-indigo-700 hover:text-white hover:bg-indigo-600 bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-lg shadow-sm font-bold transition-all active:scale-95">
                          Mark Returned
                        </button>
                      ) : (
                        <span className="text-gray-400 font-bold block text-center px-4 py-1.5">✓ Cleared</span>
                      )}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-sm font-semibold text-gray-500">No active transactions logged.</td></tr>
                )}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Transactions;

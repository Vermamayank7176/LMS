import React, { useState, useEffect } from 'react';
import api from '../utils/api';

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
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Manage Transactions</h1>

      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600">
        <h2 className="text-xl font-bold mb-4">Issue a Book</h2>
        <form onSubmit={handleIssue} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select User</label>
            <select required className="mt-1 block w-full pl-3 pr-10 py-2 border rounded-md"
                    value={issueData.user} onChange={e => setIssueData({...issueData, user: e.target.value})}>
              <option value="">- Select User -</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Book</label>
            <select required className="mt-1 block w-full pl-3 pr-10 py-2 border rounded-md"
                    value={issueData.book} onChange={e => setIssueData({...issueData, book: e.target.value})}>
              <option value="">- Select Book -</option>
              {books.map(b => (
                <option key={b._id} value={b._id} disabled={b.availableCopies <= 0}>
                  {b.title} ({b.availableCopies} avail)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input type="date" required className="mt-1 block w-full px-3 py-2 border rounded-md"
                   value={issueData.dueDate} onChange={e => setIssueData({...issueData, dueDate: e.target.value})} />
          </div>
          <div>
            <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Issue Book
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
         <h2 className="text-xl font-bold p-6 border-b bg-gray-50">Transaction History</h2>
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates (Issue / Due / Return)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map(tx => (
                  <tr key={tx._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.user?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.book?.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      I: {new Date(tx.issueDate).toLocaleDateString()}<br/>
                      D: {new Date(tx.dueDate).toLocaleDateString()}<br/>
                      {tx.returnDate && `R: ${new Date(tx.returnDate).toLocaleDateString()}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        tx.status === 'returned' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {tx.status === 'issued' && (
                        <button onClick={() => handleReturn(tx._id)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded">
                          Mark Returned
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No transactions found</td></tr>
                )}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Transactions;

import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { BookPlus, Search } from 'lucide-react';

const Books = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  
  // For Admin Book Creation
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', category: '', totalCopies: 1 });

  useEffect(() => {
    fetchBooks();
  }, [search]);

  const fetchBooks = async () => {
    try {
      const { data } = await api.get(`/books${search ? `?keyword=${search}` : ''}`);
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/books', newBook);
      setNewBook({ title: '', author: '', category: '', totalCopies: 1 });
      setShowAddForm(false);
      fetchBooks();
    } catch (error) {
      console.error("Error creating book", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Library Catalog</h1>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <BookPlus size={18} /> {showAddForm ? 'Cancel' : 'Add Book'}
          </button>
        )}
      </div>

      {showAddForm && user?.role === 'admin' && (
         <form onSubmit={handleAddBook} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Title" required className="border p-2 rounded"
                     value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
              <input type="text" placeholder="Author" required className="border p-2 rounded"
                     value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} />
              <input type="text" placeholder="Category" required className="border p-2 rounded"
                     value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} />
              <input type="number" placeholder="Total Copies" required min="1" className="border p-2 rounded"
                     value={newBook.totalCopies} onChange={e => setNewBook({...newBook, totalCopies: parseInt(e.target.value)})} />
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Save Book</button>
         </form>
      )}

      <div className="relative">
        <input 
          type="text" 
          placeholder="Search by title, author, or category..." 
          className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Availability</th>
              {user?.role === 'admin' && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map(book => (
              <tr key={book._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    book.availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {book.availableCopies} / {book.totalCopies} Available
                  </span>
                </td>
                {user?.role === 'admin' && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    <button onClick={() => handleDelete(book._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                )}
              </tr>
            ))}
            {books.length === 0 && (
              <tr><td colSpan={user?.role === 'admin' ? 5 : 4} className="px-6 py-4 text-center text-gray-500">No books found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Books;

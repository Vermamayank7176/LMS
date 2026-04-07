import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Search, Plus, Edit2, Trash2, Book, BookmarkPlus } from 'lucide-react';

const Books = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modals / forms state
  const [formData, setFormData] = useState({ title: '', author: '', category: '', totalCopies: 1 });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [search]);

  const fetchBooks = async () => {
    try {
      const { data } = await api.get(`/books?keyword=${search}`);
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
    setLoading(false);
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/books', formData);
      setFormData({ title: '', author: '', category: '', totalCopies: 1 });
      setIsAdding(false);
      fetchBooks();
    } catch (error) {
      alert('Error adding book. You must be an admin.');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to completely remove this book?')) {
      try {
        await api.delete(`/books/${id}`);
        fetchBooks();
      } catch (error) {
        alert('Error deleting book');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
             <Book className="text-indigo-600" size={36}/> Books Catalog
          </h1>
          <p className="text-gray-500 font-medium mt-1">Browse and manage the library's collection</p>
        </div>
        
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
          >
            {isAdding ? 'Cancel' : <><Plus size={18} /> Add New Book</>}
          </button>
        )}
      </div>

      {isAdding && user?.role === 'admin' && (
        <div className="glass rounded-3xl p-6 shadow-xl border border-white/60 animate-fade-in-up">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BookmarkPlus className="text-indigo-500" /> Register New Book</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end" onSubmit={handleCreateBook}>
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="glass-input w-full px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400 font-medium" placeholder="E.g., The Great Gatsby" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Author</label>
              <input type="text" required value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="glass-input w-full px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400 font-medium" placeholder="Scott Fitzgerald" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
              <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="glass-input w-full px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400 font-medium" placeholder="Fiction" />
            </div>
            <div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95">Save Book</button>
            </div>
          </form>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-indigo-400" size={20} />
        </div>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="glass-input w-full block pl-12 pr-4 py-4 rounded-2xl text-md font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-500 shadow-md" 
          placeholder="Search catalog by title, author, or category..." 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map(book => (
          <div key={book._id} className="glass rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-white/60 flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex-grow">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full mb-3 border border-indigo-100 shadow-sm">
                {book.category}
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-1 line-clamp-2">{book.title}</h3>
              <p className="text-sm font-semibold text-gray-500 mb-4">By {book.author}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200/60 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-gray-500 block uppercase tracking-wider">Availability</span>
                <span className={`text-lg font-black ${book.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {book.availableCopies} / {book.totalCopies}
                </span>
              </div>
              
              {user?.role === 'admin' && (
                <button 
                  onClick={() => handleDelete(book._id)}
                  className="p-2.5 text-gray-400 hover:text-white hover:bg-rose-500 rounded-xl transition-all shadow-sm"
                  title="Delete Book"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {books.length === 0 && !loading && (
        <div className="text-center py-20 bg-white/40 rounded-3xl border border-dashed border-gray-300">
          <Book className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-900">No books found</h3>
          <p className="text-gray-500 mt-2 font-medium">Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  );
};

export default Books;

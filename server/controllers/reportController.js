const Book = require('../models/Book');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Fine = require('../models/Fine');

// @desc    Get dashboard stats
// @route   GET /api/reports/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const issuedTransactions = await Transaction.countDocuments({ status: 'issued' });
    const outstandingFines = await Fine.find({ status: 'unpaid' });
    
    const fineAmount = outstandingFines.reduce((acc, fine) => acc + fine.amount, 0);

    res.json({
      totalBooks,
      totalUsers,
      issuedBooks: issuedTransactions,
      outstandingFines: fineAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get fines and overdue reports
// @route   GET /api/reports/fines
// @access  Private/Admin
const getFines = async (req, res) => {
  try {
    const fines = await Fine.find().populate('user', 'name email').populate({
      path: 'transaction',
      populate: { path: 'book', select: 'title' }
    });
    res.json(fines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pay fine
// @route   PUT /api/reports/fines/:id/pay
// @access  Private/Admin
const payFine = async (req, res) => {
  try {
    const fine = await Fine.findById(req.params.id);
    if (fine) {
      fine.status = 'paid';
      await fine.save();
      res.json({ message: 'Fine marked as paid' });
    } else {
      res.status(404).json({ message: 'Fine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getDashboardStats,
  getFines,
  payFine
};

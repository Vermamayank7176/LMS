const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Fine = require('../models/Fine');

// @desc    Issue a book
// @route   POST /api/transactions/issue
// @access  Private/Admin
const issueBook = async (req, res) => {
  try {
    const { user, book, dueDate } = req.body;

    const bookRec = await Book.findById(book);
    if (!bookRec || bookRec.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book not available for issue' });
    }

    const transaction = new Transaction({
      user,
      book,
      dueDate,
    });

    await transaction.save();

    bookRec.availableCopies -= 1;
    await bookRec.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return a book
// @route   POST /api/transactions/return/:id
// @access  Private/Admin
const returnBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction || transaction.status === 'returned') {
      return res.status(400).json({ message: 'Invalid or already returned transaction' });
    }

    transaction.returnDate = new Date();
    transaction.status = 'returned';
    await transaction.save();

    const bookRec = await Book.findById(transaction.book);
    if (bookRec) {
      bookRec.availableCopies += 1;
      await bookRec.save();
    }

    // Check fine (Rs. 10 per day overdue)
    const due = new Date(transaction.dueDate);
    const returned = new Date(transaction.returnDate);
    
    if (returned > due) {
      const diffTime = Math.abs(returned - due);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      const fine = new Fine({
        user: transaction.user,
        transaction: transaction._id,
        amount: diffDays * 10
      });
      await fine.save();
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private/Admin
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('user', 'name email').populate('book', 'title');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my transactions
// @route   GET /api/transactions/my
// @access  Private
const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).populate('book', 'title');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  issueBook,
  returnBook,
  getTransactions,
  getMyTransactions
};

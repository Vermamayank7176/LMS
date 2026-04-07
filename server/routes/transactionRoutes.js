const express = require('express');
const router = express.Router();
const {
  issueBook,
  returnBook,
  getTransactions,
  getMyTransactions
} = require('../controllers/transactionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getTransactions);
router.route('/my').get(protect, getMyTransactions);
router.route('/issue').post(protect, admin, issueBook);
router.route('/return/:id').post(protect, admin, returnBook);

module.exports = router;

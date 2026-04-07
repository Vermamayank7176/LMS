const express = require('express');
const router = express.Router();
const { getDashboardStats, getFines, payFine } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/dashboard').get(protect, admin, getDashboardStats);
router.route('/fines').get(protect, admin, getFines);
router.route('/fines/:id/pay').put(protect, admin, payFine);

module.exports = router;

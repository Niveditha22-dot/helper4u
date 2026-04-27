const express = require('express');
const router = express.Router();
const { getStats, verifyHelper, getAllHelpers, getAllUsers, toggleUserStatus, getComplaints, resolveComplaint } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/helpers', getAllHelpers);
router.put('/helpers/:id/verify', verifyHelper);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.get('/complaints', getComplaints);
router.put('/complaints/:id/resolve', resolveComplaint);

module.exports = router;

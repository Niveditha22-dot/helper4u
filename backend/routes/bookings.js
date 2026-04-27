const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getHelperBookings, updateBookingStatus, getAllBookings } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('user'), createBooking);
router.get('/my', protect, authorize('user'), getMyBookings);
router.get('/helper', protect, authorize('helper'), getHelperBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.get('/', protect, authorize('admin'), getAllBookings);

module.exports = router;

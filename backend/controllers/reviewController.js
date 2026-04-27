const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Helper = require('../models/Helper');

// @route POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not your booking' });
    if (booking.status !== 'completed')
      return res.status(400).json({ success: false, message: 'Can only review completed bookings' });
    if (booking.isReviewed)
      return res.status(400).json({ success: false, message: 'Already reviewed' });

    const review = await Review.create({
      booking: bookingId, user: req.user._id,
      helper: booking.helper, rating, comment,
    });
    booking.isReviewed = true;
    await booking.save();

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/reviews/helper/:helperId
exports.getHelperReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ helper: req.params.helperId })
      .populate('user', 'name profilePicture')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

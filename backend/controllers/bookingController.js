const Booking = require('../models/Booking');
const Helper = require('../models/Helper');

// @route POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { helperId, servicePlan, serviceType, startDate, endDate, hoursPerDay, notes } = req.body;
    const helper = await Helper.findById(helperId);
    if (!helper) return res.status(404).json({ success: false, message: 'Helper not found' });
    if (!helper.isVerified) return res.status(400).json({ success: false, message: 'Helper is not yet verified' });

    // Calculate amount
    let amount = 0;
    if (servicePlan === 'hourly') amount = helper.plans.hourly * (hoursPerDay || 1);
    else if (servicePlan === 'monthly') amount = helper.plans.monthly;
    else if (servicePlan === 'yearly') amount = helper.plans.yearly || helper.plans.monthly * 11;

    const booking = await Booking.create({
      user: req.user._id, helper: helperId,
      servicePlan, serviceType: serviceType || helper.serviceType,
      startDate, endDate, hoursPerDay, amount, notes,
    });

    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'helper', populate: { path: 'user', select: 'name' } },
    ]);

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({ path: 'helper', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/bookings/helper
exports.getHelperBookings = async (req, res) => {
  try {
    const helper = await Helper.findOne({ user: req.user._id });
    if (!helper) return res.status(404).json({ success: false, message: 'Helper profile not found' });

    const bookings = await Booking.find({ helper: helper._id })
      .populate('user', 'name email phone location')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.status = status;
    if (status === 'accepted') booking.helperAcceptedAt = new Date();
    if (status === 'completed') {
      booking.completedAt = new Date();
      await Helper.findByIdAndUpdate(booking.helper, { $inc: { totalJobs: 1 } });
    }
    if (status === 'cancelled') {
      booking.cancelledAt = new Date();
      booking.cancellationReason = cancellationReason;
    }
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate({ path: 'helper', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    res.json({ success: true, total, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

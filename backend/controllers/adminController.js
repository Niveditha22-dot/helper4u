const User = require('../models/User');
const Helper = require('../models/Helper');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');
const Review = require('../models/Review');

// @route GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalHelpers, verifiedHelpers, totalBookings, activeBookings, complaints] =
      await Promise.all([
        User.countDocuments({ role: 'user' }),
        Helper.countDocuments(),
        Helper.countDocuments({ isVerified: true }),
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'active' }),
        Complaint.countDocuments({ status: 'open' }),
      ]);

    const revenueData = await Booking.aggregate([
      { $match: { status: { $in: ['active', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    const bookingsByService = await Booking.aggregate([
      { $group: { _id: '$serviceType', count: { $sum: 1 } } }
    ]);

    const bookingsByPlan = await Booking.aggregate([
      { $group: { _id: '$servicePlan', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalHelpers, verifiedHelpers, totalBookings, activeBookings, openComplaints: complaints, totalRevenue },
      bookingsByService,
      bookingsByPlan,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/admin/helpers/:id/verify
exports.verifyHelper = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const helper = await Helper.findByIdAndUpdate(
      req.params.id,
      { isVerified: status === 'approved', verificationStatus: status },
      { new: true }
    ).populate('user', 'name email');
    if (!helper) return res.status(404).json({ success: false, message: 'Helper not found' });
    res.json({ success: true, helper });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/admin/helpers
exports.getAllHelpers = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status === 'pending') filter.verificationStatus = 'pending';
    if (status === 'verified') filter.isVerified = true;
    const skip = (page - 1) * limit;
    const total = await Helper.countDocuments(filter);
    const helpers = await Helper.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip).limit(Number(limit));
    res.json({ success: true, total, helpers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/admin/users/:id/toggle
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/admin/complaints
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email')
      .populate({ path: 'helper', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/admin/complaints/:id/resolve
exports.resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved', adminNotes: req.body.notes, resolvedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

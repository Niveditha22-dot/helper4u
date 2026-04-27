const Helper = require('../models/Helper');
const User = require('../models/User');

// @route GET /api/helpers
exports.getHelpers = async (req, res) => {
  try {
    const { serviceType, city, plan, minExp, maxPrice, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };

    if (serviceType) filter.serviceType = serviceType;
    if (city) filter.city = new RegExp(city, 'i');
    if (minExp) filter.experience = { $gte: Number(minExp) };
    if (plan === 'hourly') filter['plans.hourly'] = { $exists: true };
    if (plan === 'monthly') filter['plans.monthly'] = { $exists: true };
    if (maxPrice && plan === 'hourly') filter['plans.hourly'] = { $lte: Number(maxPrice) };

    const skip = (page - 1) * limit;
    const total = await Helper.countDocuments(filter);
    const helpers = await Helper.find(filter)
      .populate('user', 'name email phone profilePicture')
      .sort({ rating: -1, totalReviews: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: helpers.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      helpers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/helpers/:id
exports.getHelperById = async (req, res) => {
  try {
    const helper = await Helper.findById(req.params.id).populate('user', 'name email phone profilePicture');
    if (!helper) return res.status(404).json({ success: false, message: 'Helper not found' });
    res.json({ success: true, helper });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/helpers/profile
exports.createHelperProfile = async (req, res) => {
  try {
    const exists = await Helper.findOne({ user: req.user._id });
    if (exists) return res.status(400).json({ success: false, message: 'Helper profile already exists' });

    const helper = await Helper.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, helper });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/helpers/profile
exports.updateHelperProfile = async (req, res) => {
  try {
    const helper = await Helper.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone');
    if (!helper) return res.status(404).json({ success: false, message: 'Helper profile not found' });
    res.json({ success: true, helper });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/helpers/my/profile
exports.getMyProfile = async (req, res) => {
  try {
    const helper = await Helper.findOne({ user: req.user._id }).populate('user', 'name email phone');
    if (!helper) return res.status(404).json({ success: false, message: 'No helper profile found' });
    res.json({ success: true, helper });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

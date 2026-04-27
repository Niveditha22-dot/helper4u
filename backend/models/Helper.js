const mongoose = require('mongoose');

const helperSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: { type: String, enum: ['Maid', 'Nanny', 'Babysitter'], required: true },
  experience: { type: Number, required: true, min: 0 },
  bio: { type: String, maxlength: 500 },
  skills: [{ type: String }],
  location: { type: String, required: true },
  city: { type: String, required: true },

  // Verification
  isVerified: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  documents: [{
    type: { type: String },
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Availability
  availability: {
    days: [{ type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }],
    timeFrom: String,
    timeTo: String,
  },

  // Pricing
  plans: {
    hourly: { type: Number },
    monthly: { type: Number },
    yearly: { type: Number },
  },

  // Ratings
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Helper', helperSchema);

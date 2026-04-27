const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  helper: { type: mongoose.Schema.Types.ObjectId, ref: 'Helper', required: true },

  servicePlan: { type: String, enum: ['hourly', 'monthly', 'yearly'], required: true },
  serviceType: { type: String, enum: ['Maid', 'Nanny', 'Babysitter'], required: true },

  startDate: { type: Date, required: true },
  endDate: { type: Date },
  hoursPerDay: { type: Number },

  amount: { type: Number, required: true },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'active', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },

  notes: { type: String },

  // Tracking
  helperAcceptedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String,

  isReviewed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);

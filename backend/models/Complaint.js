const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  helper: { type: mongoose.Schema.Types.ObjectId, ref: 'Helper', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  issue: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['open', 'under_review', 'resolved', 'closed'], default: 'open' },
  adminNotes: { type: String },
  resolvedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);

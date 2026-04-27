const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  helper: { type: mongoose.Schema.Types.ObjectId, ref: 'Helper', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 },
}, { timestamps: true });

// After saving a review, update helper's average rating
reviewSchema.post('save', async function () {
  const Helper = require('./Helper');
  const reviews = await this.constructor.find({ helper: this.helper });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Helper.findByIdAndUpdate(this.helper, {
    rating: Math.round(avg * 10) / 10,
    totalReviews: reviews.length,
  });
});

module.exports = mongoose.model('Review', reviewSchema);

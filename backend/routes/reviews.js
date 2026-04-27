const express = require('express');
const router = express.Router();
const { createReview, getHelperReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('user'), createReview);
router.get('/helper/:helperId', getHelperReviews);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getHelpers, getHelperById, createHelperProfile, updateHelperProfile, getMyProfile } = require('../controllers/helperController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getHelpers);
router.get('/my/profile', protect, authorize('helper'), getMyProfile);
router.get('/:id', getHelperById);
router.post('/profile', protect, authorize('helper'), createHelperProfile);
router.put('/profile', protect, authorize('helper'), updateHelperProfile);

module.exports = router;

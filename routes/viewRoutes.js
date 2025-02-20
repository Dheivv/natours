const express = require('express');
const viewsController = require('../controllers/viewsController.js');
const authController = require('../controllers/authController.js');
const bookingController = require('../controllers/bookingController.js');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get(
  '/verify-your-account',
  authController.protect,
  viewsController.getAccountVerification,
);
router.get(
  '/additional-info',
  authController.isLoggedIn,
  viewsController.getAdditionalInfo,
);

router.get(
  '/me',
  authController.isVerified,
  authController.protect,
  viewsController.getAccount,
);
router.get(
  '/my-tours',
  authController.isVerified,
  authController.protect,
  viewsController.getMyTours,
);
router.get(
  '/my-reviews',
  authController.isVerified,
  authController.protect,
  viewsController.getMyReviews,
);
router.get(
  '/leave-review/:id',
  authController.isVerified,
  authController.protect,
  viewsController.getReviewForm,
);

router.post(
  '/submit-user-data',
  authController.isVerified,
  authController.protect,
  viewsController.updateUserData,
);

module.exports = router;

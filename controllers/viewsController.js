const Tour = require('../models/tourModel.js');
const User = require('../models/userModel.js');
const Review = require('../models/reviewModel.js');
const Booking = require('../models/bookingModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');
const authController = require('./authController.js');
const { Reviews } = require('stripe/lib/resources.js');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for confirmation. If your booking doesn't show up immediately, please come back later";
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  const booking = await Booking.find({ price: tour.price });

  if (!tour) {
    return next(new AppError('There is no tour with that name!', 404));
  }

  const too_late = [];
  for (let i = 0; i <= tour.startDates.length - 1; i++) {
    too_late.push(
      Date.now() / 1000 > parseInt(tour.startDates[i].getTime() / 1000, 10),
    );
  }

  // 2) Build template

  // 3) Render template using data from 1)

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour: tour,
    booking: booking,
    too_late: too_late,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create a new account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  const reviews = await Review.find({
    user: req.user.id,
  });
  const reviewedTours = reviews.map((el) => el.tour);
  const reviewedToursIDs = reviewedTours.map((el) => el.id);

  const too_late = {};
  for (let i = 0; i <= tours.length - 1; i++) {
    const startDatesList = [];

    for (let j = 0; j <= tours[i].startDates.length - 1; j++) {
      startDatesList.push(
        Date.now() / 1000 >
          parseInt(tours[i].startDates[j].getTime() / 1000, 10),
      );
    }

    too_late[tours[i].id] = startDatesList;
  }

  res.status(200).render('myTours', {
    title: 'My Tours',
    tours: tours,
    reviews: reviews,
    reviewedToursIDs: reviewedToursIDs,
    too_late: too_late,
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id });
  const tourIDs = reviews.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('myReviews', {
    title: 'My reviews',
    reviews: reviews,
    tours: tours,
  });
});

exports.getReviewForm = catchAsync(async (req, res, next) => {
  res.status(200).render('leaveReview', {
    title: 'Leave review',
    userID: req.user.id,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

exports.getAdditionalInfo = (req, res, next) => {
  res.status(200).render('additionalInfo', {
    title: 'Additional Info',
  });
};

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel.js');
const Booking = require('../models/bookingModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');
const factory = require('./handlerFactory.js');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const price_data = {
    currency: 'usd',
    unit_amount: tour.price * 100,
    tax_behavior: 'exclusive',
    product_data: {
      name: tour.name,
      description: tour.summary,
      images: [
        `${req.protocol}://www.natours.dev/img/tours/${tour.imageCover}`,
      ],
    },
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: price_data,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });

  // console.log(
  //   `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
  // );
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY because it's UNSECURE: everyone can make bookings without paying if they figure out the success_url
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

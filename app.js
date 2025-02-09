const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// const xssFilters = require('xss-filters'); non so come dio bestia funziona 😭😭😭
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const reviewRouter = require('./routes/reviewRoutes.js');
const bookingRouter = require('./routes/bookingRoutes.js');
const viewRouter = require('./routes/viewRoutes.js');

// Start express app
const app = express();

// Set default view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMilliseconds: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api/', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanatization against NoSQL query injection
app.use(mongoSanitize());

// Data sanatization against XSS
app.use((req, res, next) => {
  const forbiddenChar = ['<', '>'];
  // console.log(forbiddenChar);
  const nameObj = { ...req.body.name };
  const passwordObj = { ...req.body.password };
  const emailObj = { ...req.body.email };
  nameStr = JSON.stringify(nameObj);
  passwordStr = JSON.stringify(passwordObj);
  emailStr = JSON.stringify(emailObj);
  for (index = 0; index < forbiddenChar.length; index++) {
    if (
      nameStr.indexOf(forbiddenChar[index]) > -1 ||
      passwordStr.indexOf(forbiddenChar[index]) > -1 ||
      emailStr.indexOf(forbiddenChar[index]) > -1
    ) {
      return next(
        new AppError(
          `Invalid characters detected in one or more authentication field(s). Please refrain from using characters from this list: ${forbiddenChar}...`,
          400,
        ),
      );
    }
  }

  next();
});

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
// console.log(process.env.NODE_ENV);

module.exports = app;

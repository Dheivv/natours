/* eslint-disable */
//- import 'core-js';
import { displayMap } from './mapbox.js';
import { login, logout } from './login.js';
import { signup } from './signup.js';
import { updateSettings } from './updateSettings.js';
import { leaveReview } from './leaveReview.js';
import { bookTour } from './stripe.js';
import { showAlert } from './alerts.js';
import { additionalInfo } from './additionalInfo.js';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const signupForm = document.querySelector('.form--signup');
const reviewForm = document.querySelector('.form--review');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const footerLinks = document.querySelector('.footer__nav');
const deleteExpiredBookingBtn = document.querySelectorAll('.btn-very-small');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations,
  );
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const tour = window.location.pathname.split('/')[2];
    const user = document.getElementById('leave-review').dataset.id;

    await leaveReview(review, rating, tour, user);
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage && alertMessage != '') showAlert('success', alertMessage, 20);

footerLinks.addEventListener('click', () => {
  additionalInfo();
});

[...deleteExpiredBookingBtn].forEach((item) => {
  item.addEventListener('click', async (e) => {
    e.preventDefault();
    const confirmHide = await confirm('Hide expired booking card?');

    if (confirmHide) {
      item.parentElement.parentElement.style.display = 'none';
      // console.log(item.parentElement.parentElement);
      showAlert('success', 'Booking card hidden from list');
      window.localStorage.setItem(`display option for ${item}`, 'none');
    }
  });
});

/*
window.addEventListener('load', (e) => {
  e.preventDefault();
  [...deleteExpiredBookingBtn].forEach((item) => {
    if (window.localStorage.getItem(`display option for ${item}`) === 'none') {
      item.parentElement.parentElement.style.display = 'none';
    }
  });
});
*/

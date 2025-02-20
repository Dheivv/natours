/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts.js';

export const leaveReview = async (review, rating, tour, user, button) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/reviews',
      data: {
        review,
        rating,
        tour,
        user,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Review created successfully!');
      button.textContent = 'Confirm';
      window.setTimeout(() => {
        location.assign('/my-reviews');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    button.textContent = 'Confirm';
  }
};

/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts.js';

export const signup = async (
  name,
  email,
  password,
  passwordConfirm,
  button,
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    // console.log(res);
    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Signed up successfully! Check your email for confirmation',
      );
      button.textContent = 'Signup';
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    button.textContent = 'Signup';
  }
};

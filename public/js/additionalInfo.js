/* eslint-disable */
import axios from 'axios';

export const additionalInfo = async (req, res) => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/additional-info',
    });

    // console.log(res);
  } catch (err) {
    console.log(err.response.data.message);
  }
};

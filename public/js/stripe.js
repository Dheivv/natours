/*eslint-disable*/
import axios from 'axios';
const stripe = Stripe(
  'pk_test_51QpGTDGhFjwn8yijcVsGq63oIrYbp8fzalBZKGFT4xcajNwx5TZj3TQnneydjhYKHfqXfLMaUGBBvrzN8tTH8Cz600lgxfqiDj',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + change card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

const Stripe = require('stripe');
// Make sure you have STRIPE_SECRET_KEY in your .env file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Stripe expects amounts in cents
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency,
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ clientSecret: intent.client_secret });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPaymentIntent };
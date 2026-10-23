const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Stripe expects amounts in the smallest currency unit (cents)
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency,
      automatic_payment_methods: { enabled: true },
      // You can attach metadata to link this payment to a user later
      metadata: { integration_check: 'accept_a_payment' }
    });

    res.status(200).json({ clientSecret: intent.client_secret });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPaymentIntent };
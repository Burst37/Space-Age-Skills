const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId } = req.body;

  if (!priceId || !priceId.startsWith('price_')) {
    return res.status(400).json({ error: 'Invalid price ID' });
  }

  try {
    const origin = req.headers.origin || 'https://privatenightclubstl.com';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${origin}/success.html`,
      cancel_url:  `${origin}?payment=cancelled#book`,
      billing_address_collection: 'auto',
      custom_text: {
        submit: { message: 'See you tonight at Private Night Club STL' }
      }
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

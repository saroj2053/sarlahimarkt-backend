const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: product.productName,
        images: [product.productImage],
      },
      unit_amount: Math.round(product.sellingPrice * 100),
    },
    quantity: product.qty,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "https://sarlahimarkt.vercel.app/success",
      cancel_url: "https://sarlahimarkt.vercel.app/cancel",
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

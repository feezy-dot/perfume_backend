import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;

  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  const event = req.body;

  if (event.event === "charge.success") {
    console.log("Payment successful:", event.data.reference);
  }

  return res.status(200).json({ received: true });
}

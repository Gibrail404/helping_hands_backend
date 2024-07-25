import axios from "axios";
import crypto from "crypto";
import { Volunteer } from "../models/volunteer.js";

export const checkout = async (req, res) => {
  try {
    const { amount } = req.body;
    const invoice = await createInvoice(amount);
    await Volunteer.create({
      ...req.body,
      orderId: invoice.result.order_id,
      paymentStatus: invoice.result.status,
    });
    res.send(invoice);
    console.log(amount);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Base URL
const cryptomus = axios.create({ baseURL: "https://api.cryptomus.com/v1" });

const createInvoice = async (amount) => {
  try {
    const data = {
      amount: amount,
      currency: "USD",
      order_id: crypto.randomBytes(12).toString("hex"),
      url_return: "https://helping-hands-jade.vercel.app/donate",
      url_success: "https://helping-hands-jade.vercel.app/",
      lifetime: 300,
    };

    const sign = crypto
      .createHash("md5")
      .update(
        Buffer.from(JSON.stringify(data)).toString("base64") +
          process.env.PAYMENT_API_KEY
      )
      .digest("hex");

    const headers = {
      merchant: process.env.MERCHANT_ID,
      sign,
    };

    const response = await cryptomus.post("/payment", data, { headers });

    return response.data;
  } catch (error) {
    console.error("Error Occured:", error);
    throw error;
  }
};

import { Message } from "../models/message.js";

export const postMessage = async (req, res, next) => {

  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: "Please Fill Full Form!",
    });
  }

  try {
    await Message.create({ name, email, phone, message });
    return res.status(201).json({
      success: true,
      message: "Messsage Sent Successfully!",
    });
  } 
  catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );

      const errorMessage = validationErrors.join(", ");
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }

};

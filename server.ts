import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Resend } from "resend";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());

const resendApiKey = process.env.RESEND_API_KEY;
const toEmail = process.env.RESEND_TO_EMAIL;
const fromEmail = process.env.RESEND_FROM_EMAIL;

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not defined in environment variables.");
}

if (!toEmail) {
  throw new Error("RESEND_TO_EMAIL is not defined in environment variables.");
}

if (!fromEmail) {
  throw new Error("RESEND_FROM_EMAIL is not defined in environment variables.");
}

const resend = new Resend(resendApiKey);
app.post("/send-email", async (req: Request, res: Response): Promise<void> => {
  try {
    const { from_name, from_email, message } = req.body;

    if (!from_name || !from_email || !message) {
      res.status(400).json({
        error: " All fields are required in the request body.",
      });
    }

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${from_name}</p>
        <p><strong>Email:</strong> ${from_email}</p>
        <p><strong>Message:</strong> ${message}</p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `New message from ${from_name}`,
      html: emailTemplate,
    });

    if (error) {
      res.status(400).json(error);
    }
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

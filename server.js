"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const resend_1 = require("resend");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
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
const resend = new resend_1.Resend(resendApiKey);
app.post("/send-email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { data, error } = yield resend.emails.send({
            from: fromEmail,
            to: [toEmail],
            subject: `New message from ${from_name}`,
            html: emailTemplate,
        });
        if (error) {
            res.status(400).json(error);
        }
        res.status(200).json({ data });
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error", details: err });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

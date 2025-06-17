# Portfolio API

This is a simple backend API for handling contact form submissions for the Kevin Lopez portfolio website. It receives contact messages and sends them via email using the [Resend](https://resend.com/) email service.

## Features

- Accepts contact form submissions via a REST endpoint.
- Sends emails using Resend.
- CORS enabled for frontend integration.
- Environment variable configuration for sensitive data.

## Endpoints

### POST `/send-email`

Sends a contact message via email.

#### Request Body

```json
{
  "from_name": "Your Name",
  "from_email": "your.email@example.com",
  "message": "Your message here"
}
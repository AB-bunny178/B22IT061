# URL Shortener Microservice 🚀

This project is a **microservice** built with **Express.js** that shortens long URLs, supports custom shortcodes, and enforces expiry times. It uses a **custom logging middleware** to track all events.

---

## Features
- Shorten long URLs into unique shortcodes.
- Custom shortcode support.
- Default expiry of **30 minutes** (can be customized).
- Redirects users to the original link if valid.
- Logs every action via a remote logging API.

---

## Project Structure
url-shortener-service/
├── middleware/logger.js # Logging middleware
├── app.js # Main service
├── package.json

yaml
Copy code

---

## How It Works
1. **POST `/shorturls`**  
   Creates a short URL.  
   Request:
   ```json
   {
     "url": "https://example.com/long/path",
     "validity": 30,
     "shortcode": "abc123"
   }


 
Response :
{
  "shortUrl": "http://localhost:3000/abc123",
  "expiryMinutes": 30
}


GET /:shortcode
Redirects to the original URL.

404 → Not found

410 → Expired

Logging

Every step uses the logging middleware:

Request received → info

Short URL created → info

Expired/invalid URL → warn / error

Unexpected crash → fatal

This makes the service easier to debug and monitor.

Quick Start
npm install
npm start


Service runs on:
👉 http://localhost:3000

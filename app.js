const express = require("express");
const crypto = require("crypto");
const { Log, requestLogger } = require("./middleware/logger");

const app = express();
app.use(express.json());
app.use(requestLogger);

const urlDatabase = {};

function generateShortCode() {
  return crypto.randomBytes(4).toString("hex");
}

app.post("/shorturls", async (req, res) => {
  try {
    const { url, validity, shortcode } = req.body;

    if (!url) {
      await Log("backend", "error", "handler", "URL is required");
      return res.status(400).json({ error: "URL is required" });
    }

    let shortCode = shortcode || generateShortCode();
    if (urlDatabase[shortCode]) {
      await Log("backend", "error", "handler", "Shortcode already exists");
      return res.status(400).json({ error: "Shortcode already exists" });
    }

    const expiryMinutes = validity && Number.isInteger(validity) ? validity : 30;
    const expiryTime = Date.now() + expiryMinutes * 60 * 1000;

    urlDatabase[shortCode] = { url, expiryTime };

    await Log("backend", "info", "service", `Short URL created: ${shortCode}`);

    res.status(201).json({
      shortUrl: `http://localhost:3000/${shortCode}`,
      expiryMinutes
    });
  } catch (err) {
    await Log("backend", "fatal", "handler", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/:shortcode", async (req, res) => {
  try {
    const { shortcode } = req.params;
    const entry = urlDatabase[shortcode];

    if (!entry) {
      await Log("backend", "warn", "repository", `Shortcode not found: ${shortcode}`);
      return res.status(404).json({ error: "Short URL not found" });
    }

    if (Date.now() > entry.expiryTime) {
      await Log("backend", "warn", "repository", `Expired shortcode: ${shortcode}`);
      return res.status(410).json({ error: "Short URL expired" });
    }

    await Log("backend", "info", "service", `Redirecting shortcode: ${shortcode}`);
    res.redirect(entry.url);
  } catch (err) {
    await Log("backend", "fatal", "handler", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("URL Shortener running on http://localhost:3000");
});

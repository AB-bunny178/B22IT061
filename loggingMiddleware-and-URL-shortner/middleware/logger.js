const axios = require("axios");

const validStacks = ["backend", "frontend"];
const validLevels = ["debug", "info", "warn", "error", "fatal"];
const validPackages = [
  "cache","controller","cron_job","db","domain","handler","repository","route","service",
  "api","component","hook","page","state","style","auth","config","middleware","utils"
];

async function Log(stack, level, packageName, message) {
  try {
    if (!validStacks.includes(stack)) throw new Error(`Invalid stack: ${stack}`);
    if (!validLevels.includes(level)) throw new Error(`Invalid level: ${level}`);
    if (!validPackages.includes(packageName)) throw new Error(`Invalid package: ${packageName}`);

    const payload = { stack, level, package: packageName, message };
    const response = await axios.post("http://20.244.56.144/evaluation-service/logs", payload);
    return response.data;
  } catch (error) {
    console.error("Failed to log:", error.message);
    return null;
  }
}

function requestLogger(req, res, next) {
  const { method, url } = req;
  Log("backend", "info", "route", `Incoming request: ${method} ${url}`);
  next();
}

module.exports = { Log, requestLogger };

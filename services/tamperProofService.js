const crypto = require("crypto");

const calculateHash = (event) => {
  const eventString = `${event.eventType}|${event.timestamp}|${event.sourceAppId}|${JSON.stringify(event.dataPayload)}|${event.previousHash || ""}`;
  return crypto.createHash("sha256").update(eventString).digest("hex");
};

module.exports = { calculateHash };

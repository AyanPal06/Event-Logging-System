const Event = require("../models/eventModel");
const { calculateHash } = require("../services/tamperProofService");

// Create a new log
const createEvent = async (req, res) => {
  try {
    const { eventType, timestamp, sourceAppId, dataPayload } = req.body;

    // Find the last event to link via hash
    const lastEvent = await Event.findOne().sort({ _id: -1 });

    const event = new Event({
      eventType,
      timestamp,
      sourceAppId,
      dataPayload,
      previousHash: lastEvent?.hash || null,
    });

    event.hash = calculateHash(event);
    await event.save();

    res.status(201).json({ message: "Event logged successfully", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Query logs
const getEvents = async (req, res) => {
  try {
    const { startDate, endDate, eventType, sourceAppId, page = 1, limit = 10 } = req.query;

    const query = {};
    if (startDate && endDate) {
      query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (eventType) query.eventType = eventType;
    if (sourceAppId) query.sourceAppId = sourceAppId;

    const events = await Event.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { createEvent, getEvents };

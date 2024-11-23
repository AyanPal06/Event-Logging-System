const express = require("express");
const { createEvent, getEvents } = require("../controllers/eventController");

const router = express.Router();

router.post("/log", createEvent);
router.get("/logs", getEvents);

module.exports = router;

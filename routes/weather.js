

// routes/weather.js
const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

// Define route to get weather for a specific location
router.get("/:location", weatherController.getWeather);

// Define route to create new weather data
router.post("/", weatherController.createWeather);

// Define route to update weather data by location
router.put("/:location", weatherController.updateWeather);

// Define route to delete weather data by location
router.delete("/:location", weatherController.deleteWeather);

module.exports = router;

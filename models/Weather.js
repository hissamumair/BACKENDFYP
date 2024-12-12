// models/Weather.js
const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  location: { type: String, required: true, unique: true },
  temperature: {
    min: Number,
    max: Number,
    current: Number,
  },
  condition: String,
  icon: String,
  dailyForecast: [
    {
      date: String,
      minTemp: Number,
      maxTemp: Number,
      icon: String,
    },
  ],
  hourlyProbability: [
    {
      time: String,
      rainChance: Number,
      icon: String,
    },
  ],
});

const Weather = mongoose.model('Weather', weatherSchema);
module.exports = Weather;

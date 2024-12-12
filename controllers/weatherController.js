// // controllers/weatherController.js
// const Weather = require("../models/Weather");

// // Sample controller for fetching weather data
// exports.getWeather = async (req, res) => {
//   const { location } = req.params;

//   try {
//     // Fetch data from a weather API or database here
//     const weatherData = await Weather.findOne({ location });
    
//     // If no data is found, return a placeholder response or fetch from an external API
//     if (!weatherData) {
//       // Placeholder data as an example
//       const sampleWeather = new Weather({
//         location: location,
//         temperature: {
//           min: -2,
//           max: 25,
//           current: -5,
//         },
//         condition: "Partly Cold",
//         icon: "sun_cloud_icon", // Replace with actual icon URL
//         dailyForecast: [
//           { date: "Thursday", minTemp: -2, maxTemp: 14, icon: "rain_thunder_icon" },
//           { date: "Friday", minTemp: 10, maxTemp: 25, icon: "partly_sunny_icon" },
//           { date: "Saturday", minTemp: 15, maxTemp: 26, icon: "sunny_icon" },
//           { date: "Sunday", minTemp: -1, maxTemp: 29, icon: "windy_icon" },
//         ],
//         hourlyProbability: [
//           { time: "15:00", rainChance: 30, icon: "rain_sun_icon" },
//           { time: "16:00", rainChance: 15, icon: "cloud_icon" },
//           { time: "17:00", rainChance: 60, icon: "rain_thunder_icon" },
//           { time: "18:00", rainChance: 90, icon: "snow_icon" },
//           { time: "19:00", rainChance: 90, icon: "cloud_rain_icon" },
//         ],
//       });
      
//       await sampleWeather.save();
//       return res.status(200).json(sampleWeather);
//     }

//     res.status(200).json(weatherData);
//   } catch (error) {
//     console.error("Error fetching weather data:", error);
//     res.status(500).json({ message: "Error fetching weather data" });
//   }
// };

const Weather = require("../models/Weather");

// Function to get weather data for a specific location
exports.getWeather = async (req, res) => {
  const { location } = req.params;

  try {
    const weatherData = await Weather.findOne({ location });
    if (!weatherData) {
      return res.status(404).json({ message: "Weather data not found" });
    }
    res.status(200).json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ message: "Error fetching weather data" });
  }
};

// Function to create new weather data
exports.createWeather = async (req, res) => {
  try {
    const weatherData = new Weather(req.body);
    await weatherData.save();
    res.status(201).json(weatherData);
  } catch (error) {
    console.error("Error creating weather data:", error);
    res.status(500).json({ message: "Error creating weather data" });
  }
};

// Function to update weather data by location
exports.updateWeather = async (req, res) => {
  const { location } = req.params;

  try {
    const updatedWeather = await Weather.findOneAndUpdate(
      { location },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedWeather) {
      return res.status(404).json({ message: "Weather data not found" });
    }
    
    res.status(200).json(updatedWeather);
  } catch (error) {
    console.error("Error updating weather data:", error);
    res.status(500).json({ message: "Error updating weather data" });
  }
};

// Function to delete weather data by location
exports.deleteWeather = async (req, res) => {
  const { location } = req.params;

  try {
    const deletedWeather = await Weather.findOneAndDelete({ location });

    if (!deletedWeather) {
      return res.status(404).json({ message: "Weather data not found" });
    }
    
    res.status(204).send(); // No content to send back
  } catch (error) {
    console.error("Error deleting weather data:", error);
    res.status(500).json({ message: "Error deleting weather data" });
  }
};



const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the place schema
const placeSchema = new Schema({
  name: { type: String, required: true },  
  description: { type: String },  
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  address: { type: String },  
  price: { type: Number },  
  image: { type: String },  
  details: { type: String },  
  ratings: { type: Number, default: 0 },  
  ratingDescription: { type: String},
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]  // Array of associated reviews
});

const Place = mongoose.models.Place || mongoose.model('Place', placeSchema);

module.exports = Place;

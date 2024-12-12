

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campingSchema = new Schema({
  description: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true }
  },
  place: { type: Schema.Types.ObjectId, ref: 'Place', required: true }, 
  track: [
    {
      trackName: { type: String, required: true },
      day: {
        dayName: { type: String, required: true },
        dayDescription: { type: String, required: true }
      },
      height: {
        meters: { type: Number, required: true },
        feet: { type: Number, required: true }
      },
    }
  ]
});

module.exports = mongoose.model('Camping', campingSchema);

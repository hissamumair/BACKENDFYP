const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hikingSchema = new Schema({
  description: { type: String, required: true },
  place: { type: Schema.Types.ObjectId, ref: 'Place', required: true }, 
  trails: [
    {
      dayName: { type: String, required: true },
      trailName: { type: String, required: true },
      height: {
        meters: { type: Number, required: true },
        feet: { type: Number, required: true }
      },
      trailDescription: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('Hiking', hikingSchema);

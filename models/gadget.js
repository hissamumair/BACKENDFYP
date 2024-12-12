// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const gadgetSchema = new Schema({
//   category: { type: String, required: true },
//   name: { type: String, required: true },
//   description: { type: String },
//   imageUrl: { type: String },
//   price: { type: Number },
//   features: { type: [String] },
//   created_at: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('gadget', gadgetSchema);


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gadgetSchema = new Schema({
  description: { type: String, required: true }, 
  place: { type: Schema.Types.ObjectId, ref: 'Place', required: true }, 
  categories: [
    {
      categoryName: { type: String, required: true }, 
      tools: [
        {
          name: { type: String, required: true }, 
          description: { type: String, required: true }, 
        }
      ]
    }
  ],
  importantNotes: { type: String } 
});

module.exports = mongoose.model('Gadget', gadgetSchema);

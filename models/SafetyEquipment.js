const mongoose = require('mongoose');

const safetyEquipmentSchema = new mongoose.Schema({
  description:{type:String,required:true},
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true }, 
  equipments:[
    {
      name:{type:String},
      description:{type:String}
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('SafetyEquipment', safetyEquipmentSchema);

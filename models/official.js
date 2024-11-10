const mongoose=require('mongoose')
const { Schema } = mongoose;

const officialSchema = new Schema({
  name: {type: String, require:true},
  email: {type: String, require:true},
  phone:{type: String, require:true},
  password: {type: String, require:true},
  date: { type: Date, default: Date.now }
});


const Official=mongoose.model('official',officialSchema)
// User.createIndexes();
module.exports=Official
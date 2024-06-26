const mongoose = require('mongoose');
const UserSchema  = new mongoose.Schema({
  firstname :{
      type  : String,
      required : true
  } ,
   lastname:{
    type  : String,
    required : true
} ,
    password :{
    type  : String,
    required : true
} ,
    date :{
    type : Date,
    default : Date.now
}
},{ collection: 'users' });
const User= mongoose.model('User',UserSchema);

module.exports = User;
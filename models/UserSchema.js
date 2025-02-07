const mongoose=require('mongoose')

const UserSchema = new mongoose.Schema({
    googleId: { type: String, unique: true },
    email: String,
    displayName: String,
    photo:String
  });


const User = mongoose.model('User', UserSchema);

module.exports=User;
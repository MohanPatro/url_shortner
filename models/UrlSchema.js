const mongoose=require('mongoose');
const UrlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    alias: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    topic: { type: String },
    createdAt: { type: Date, default: Date.now },
    redirects: [{
      timestamp: Date,
      ipAddress: String,
      userAgent: String,
      osType: String,
      deviceType: String,
      location: {
        country: String,
        city: String
      }
    }]
  });


  const Url = mongoose.model('Url', UrlSchema);
  
module.exports=Url;


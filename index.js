require('dotenv').config();
const express = require('express');
const jwt=require('jsonwebtoken');
const passport = require('passport');

require('./auth/googleAuth'); 

const app = express();

const urlRoutes=require('./routes/urlRoutes');
const analyticRoutes=require('./routes/analyticRoutes');
const authRoutes=require('./routes/authRoutes')

const connection=require('./config/connection')

app.use(express.json());


app.use(passport.initialize());





app.use(authRoutes);

app.use('/api',urlRoutes);

app.use('/api',analyticRoutes);


app.get('/docs', (req, res) => {
  res.sendFile(__dirname + '/guide.html');
});



const PORT=process.env.PORT

app.listen(PORT,()=>{
  console.log("server is srunning")
})
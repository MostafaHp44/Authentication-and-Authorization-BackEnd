const express=require('express')
const App=express()
const cors=require('cors')
const mongoose=require('mongoose')
const dotenv= require('dotenv')
const newroute=require('./Routes/Routes')
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');


dotenv.config({
    path:'./config.env'
})

App.use(express.json())
App.use(bodyParser.json());
App.use(express.urlencoded({extended: true}))
App.use(cors()) // Use this after the variable declaration
App.use(passport.initialize());
App.use(passport.session());


App.use(
    session({
      secret: 'secret_key',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Set secure: true in production with HTTPS
    })
)
  

App.use('/',newroute)


mongoose.connect(process.env.myurl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false})
    .then(()=>{console.log('DataBase is Connect')})
    .catch((error)=>{console.log(error)})




App.listen(5000,()=>{console.log('Server Starting NoW.......')})


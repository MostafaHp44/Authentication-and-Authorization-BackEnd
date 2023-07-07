const express=require('express')
const App=express()
const cors=require('cors')
const mongoose=require('mongoose')
const dotenv= require('dotenv')
const newroute=require('./Routes/Routes')


dotenv.config({
    path:'./config.env'
})

App.use(express.json())
App.use(express.urlencoded({extended: true}))
App.use(cors()) // Use this after the variable declaration

App.use('/',newroute)



mongoose.connect(process.env.myurl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,})
    .then(()=>{console.log('DataBase is Connect')})
    .catch((error)=>{console.log(error)})




App.listen(5000,()=>{console.log('Server Starting NoW.......')})


const express=require('express')
const newroute=express.Router()
const controller=require('../Controller/controller')
const middel=require('../middelware/middelware')



newroute.get('/con',(req,res)=>{
    res.send('ok')
})

newroute.post('/register',controller.register)
newroute.post('/login',controller.AuthUser)
newroute.get('/profile',controller.Profile,)



module.exports=newroute
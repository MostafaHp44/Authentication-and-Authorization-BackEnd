const mongoose=require('mongoose')

const Acc= new mongoose.Schema({

    mail:{
        type:String,
        required:true,
        },

    password:{
        type:String,
        required:true,
    }
})
 

  const Accountes= mongoose.model('userapp',Acc)
  module.exports= Accountes
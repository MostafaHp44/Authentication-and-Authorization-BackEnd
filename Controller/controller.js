const bcrypt=require('bcrypt')
const Userss=require('../Models/Users.js')
const jwt = require('jsonwebtoken');
const { use } = require('passport');

const secret_key = 'secret_key';


const register=async(req,res)=>{

    try{
        const { mail, password }=req.body;

        const existingUser=await Userss.findOne({mail})
        if(existingUser)
        {
            return res.status(409).json({msg:'User already exists'})
        }

        let salt = await bcrypt.genSalt(10)
        let hashpass= await bcrypt.hash(password,salt)

        const NewUser=new Userss({
            mail,
            password:hashpass,
        })
        await NewUser.save();
        res.status(201).json({message:'User Register Successfully'})
    }
    catch (error){
        console.log(error);
        res.status(500).json({message:'Internal server Error'});
    }
}

   
const AuthUser=async(req,res)=>{
    try {
        const { mail, password } = req.body;
        const user = await Userss.findOne({ mail });
        if (!user) {
          res.status(401).json({ error: 'no user found ' });
        } 
        else
         {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            const token = jwt.sign({ userId: user._id }, 'secret_key');
            res.status(200).header('authorization',token)
            res.json({ success: true, user,token });
          } else {
            res.status(401).json({ error: 'Authentication failed' });
          }
        }
        
      } catch (error) {
        res.status(500).json({ error: 'Authentication failed' });
      }
    
    


}



const Profile=async(req,res)=>{
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'secret_key');
    const user = await Userss.findById(decoded.userId);
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}  

module.exports= {register,AuthUser,Profile}
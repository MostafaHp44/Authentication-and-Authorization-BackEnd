const bcrypt=require('bcrypt')
const Userss=require('../Models/Users.js')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

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
          res.status(401).json({ message: 'no user found ' });
        } 
        else
         {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            const token = jwt.sign({ userId: user._id }, 'secret_key');
            res.status(200).header('authorization',token)
            res.json({ success: true, user,token,message:'Login Successfully' });
          } else {
            res.status(401).json({ message: 'Authentication failed' });
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
    res.status(200).json({ success: true, user ,message:'Authorization Successfully'});
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}  


const UpdateProfile=async(req,res)=>{
  const userId = req.params.id;
  const { name, bio, phone } = req.body;

  try {
    const user = await Userss.findByIdAndUpdate(userId, { name, bio, phone });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ success: true ,message: 'User information updated successfully' });
  } catch (error) {
    console.error('Error updating user information', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const Logout= async(req,res)=>{
  req.session.destroy((err) => {
    if (err) 
    {
      console.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Failed to logout.' });
    }
    res.json({ success: true , message: 'Logout successful.' });
  });


}

passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: '/auth/google/callback'
},
(accessToken, refreshToken, profile, done) => {
  // Find or create a user based on Google profile information
  User.findOneAndUpdate(
    { googleId: profile.id },
    {
      $setOnInsert: {
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id
      }
    },
    { upsert: true, returnOriginal: false },
    (err, user) => {
      done(err, user.value);
    }
  );
}));

// Configure Facebook authentication
passport.use(new FacebookStrategy({
  clientID: 'YOUR_FACEBOOK_CLIENT_ID',
  clientSecret: 'YOUR_FACEBOOK_CLIENT_SECRET',
  callbackURL: '/auth/facebook/callback'
},
(accessToken, refreshToken, profile, done) => {
  // Find or create a user based on Facebook profile information
  User.findOneAndUpdate(
    { facebookId: profile.id },
    {
      $setOnInsert: {
        name: profile.displayName,
        facebookId: profile.id
      }
    },
    { upsert: true, returnOriginal: false },
    (err, user) => {
      done(err, user.value);
    }
  );
}));

// Configure Twitter authentication
passport.use(new TwitterStrategy({
  consumerKey: 'YOUR_TWITTER_CONSUMER_KEY',
  consumerSecret: 'YOUR_TWITTER_CONSUMER_SECRET',
  callbackURL: '/auth/twitter/callback'
},
(token, tokenSecret, profile, done) => {
  // Find or create a user based on Twitter profile information
  User.findOneAndUpdate(
    { twitterId: profile.id },
    {
      $setOnInsert: {
        name: profile.displayName,
        twitterId: profile.id
      }
    },
    { upsert: true, returnOriginal: false },
    (err, user) => {
      done(err, user.value);
    }
  );
}));

// Configure GitHub authentication
passport.use(new GitHubStrategy({
  clientID: 'YOUR_GITHUB_CLIENT_ID',
  clientSecret: 'YOUR_GITHUB_CLIENT_SECRET',
  callbackURL: '/auth/github/callback'
},
(accessToken, refreshToken, profile, done) => {
  // Find or create a user based on GitHub profile information
  User.findOneAndUpdate(
    { githubId: profile.id },
    {
      $setOnInsert: {
        name: profile.displayName,
        githubId: profile.id
      }
    },
    { upsert: true, returnOriginal: false },
    (err, user) => {
      done(err, user.value);
    }
  );
}));





module.exports= {register,AuthUser,Profile,UpdateProfile,Logout}

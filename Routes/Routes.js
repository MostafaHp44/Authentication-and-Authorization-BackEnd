const express=require('express')
const newroute=express.Router()
const controller=require('../Controller/controller')
const middel=require('../middelware/middelware')



newroute.get('/con',(req,res)=>{
    res.send('ok')
})

newroute.post('/register',controller.register)
newroute.post('/login',controller.AuthUser)
newroute.put('/update/:id',controller.UpdateProfile)
newroute.get('/profile',controller.Profile,)
newroute.get('/logout',controller.Logout)

newroute.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
newroute.get('/auth/google/callback',passport.authenticate('google', { successRedirect: '/profile', failureRedirect: '/login' }));
// Facebook authentication routes
newroute.get('/auth/facebook', passport.authenticate('facebook'));
newroute.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/profile', failureRedirect: '/login' })
);

// Twitter authentication routes
newroute.get('/auth/twitter', passport.authenticate('twitter'));

newroute.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/profile', failureRedirect: '/login' })
);

// GitHub authentication routes
newroute.get('/auth/github', passport.authenticate('github'));

newroute.get('/auth/github/callback',
  passport.authenticate('github', { successRedirect: '/profile', failureRedirect: '/login' })
);




module.exports=newroute
const User = require('../models/user');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = function(router){
    router.get('/users', function(req, res){
        res.send('User Get Method');
    });

    router.post('/register', function(req, res){
        if(!req.body.email)
        {    
            res.json({ success: false, message:'You must provide a Email'});
        } else 
        if(!req.body.username)
        {    
            res.json({ success: false, message:'You must provide a Username'});
        } else 
        if(!req.body.password)
        {    
            res.json({ success: false, message:'You must provide a password'});
        } else 
        {
            let user = new User();
            user.username = req.body.username.toLowerCase();
            user.email = req.body.email.toLowerCase();
            user.password = req.body.password;
            user.save(function(err, resp) {
                console.log("Inside Save");
                if (err) {
                    if(err.code === 11000)
                    {
                        res.json({ success: false, message: 'Username/Email already exists'});
                    }else 
                    {
                        if(err.errors)
                        {
                            if(err.errors.email)
                            {
                                res.json({ success: false, message: err.errors.email.message });      
                            }else
                            if(err.errors.username)
                            {
                                res.json({ success: false, message: err.errors.username.message });      
                            }else
                            if(err.errors.password)
                            {   
                                res.json({ success: false, message: err.errors.password.message });
                            }
                        }
                    }
                } 
                else {
                    res.send({ success: true,  message: 'User has been Registered'}); 
                }
            });
        }
        //res.send('User Post Method');
    });

    router.get('/checkEmail/:email', function(req, res){
        if(!req.params.email)
        {
            res.json({ success: false, message:'Email not provided'});
        }
        else{
        User.findOne({email : req.params.email }, function(err, user){
                if(err){
                    res.json({ success: false, message:err});
                }
                if(user){
                    res.json({ success: false, message:'Email already taken'});
                }else{
                    res.json({ success: true, message:'Email is available'});
                }
            });
        }
    });

    router.get('/checkUsername/:username', function(req, res){
        console.log("checkUsername");
        if(!req.params.username)
        {
            res.json({ success: false, message:'Username not provided'});
        }
        else{
        User.findOne({username : req.params.username }, function(err, user){
                if(err){
                    res.json({ success: false, message:err});
                }
                if(user){
                    res.json({ success: false, message:'Username already taken'});
                }else{
                    res.json({ success: true, message:'Username is available'});
                }
            });
        }
    });

    router.post('/login', function(req, res){
        let isUser = false;
        if(!req.body.username)
        {    
            res.json({ success: false, message:'Username cannot be blank'});
        } else 
        if(!req.body.password)
        {    
            res.json({ success: false, message:'Password cannot be blank'});
        } else 
        {                
            User.findOne({username : req.body.username.toLowerCase()}, function(err, user){
                isUser = true;
                console.log("Login in - " + req.body.username + " -- " + req.body.password);

                if(err){
                    res.json({ success: false, message:err});
                }
                if(!user){
                    res.json({ success: false, message:'Username was not found'});
                }else{
                    const validPassword = user.comparePassword(req.body.password);
                    if(!validPassword)
                    {
                        res.json({ success: false, message:'password invalid'});
                    }else
                    {
                        console.log("Login Successfull");
                        const token = jwt.sign({ userId:user._id } , config.secret, {expiresIn:'24h'});
                        res.json({ success: true, message:'Login Successfull', token:token, user:{username:user.username}});
                    }
                }
            });
            // if(!isUser)
            //     res.json({ success: false, message:'Enter valid credentials to login!'});
        }
    });

    router.use((req, res, next) => {
        const token = req.headers['authorization'];
        if(!token)
        {
            res.json({ success: false, message:'Token not provided'});
        } else {
            jwt.verify(token, config.secret, (err, decoded) => {
                if(err)
                {
                    res.json({ success: false, message:'Invalid token : ' + err});
                } else{
                    req.decoded = decoded;
                    next();
                }
            });
        }
    });

    router.get('/profile', function(req, res){
        User.findOne({_id : req.decoded.userId}).select('username email').exec(function(err, user){
        if(err)
        {
            console.log("Profile Authorization 1- " + err);
            res.json({ success: false, message:err});
        }   else {
            if(!user)
            {
                console.log("Profile Authorization 2- User not found");
                res.json({ success: false, message:'User not found'});
            } else{
                console.log("Profile Authorization 3- " + user.username);
                res.json({sucess: true, user:user});
            }
        }
        });      
    });

    return router;
}
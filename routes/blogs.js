const User = require('../models/user');
const Blog = require('../models/blog');
const path = require('path');
const config = require('../config/database');

module.exports = function(router){

    router.post('/newBlog', function(req, res){
        if(!req.body.title)
        {    
            res.json({ success: false, message:'You must provide a Title'});
        } else 
        if(!req.body.body)
        {    
            res.json({ success: false, message:'You must provide a body'});
        } else 
        if(!req.body.createdBy)
        {    
            res.json({ success: false, message:'You must provide who it was created By'});
        } else 
        {
            let blog = new Blog();
            blog.title = req.body.title.toLowerCase();
            blog.body = req.body.body.toLowerCase();
            blog.createdBy = req.body.createdBy;
            blog.save(function(err, resp) {
                
            console.log("new Blog Post Request -- SAVE" + blog.title + " -- " + blog.body + " -- " + blog.createdBy);
                if (err) {
                    if(err.errors)
                    {
                        if(err.errors.title)
                        {
                            res.json({ success: false, message: err.errors.title.message });      
                        }else
                        if(err.errors.body)
                        {
                            res.json({ success: false, message: err.errors.body.message });      
                        }else
                        if(err.errors.createdBy)
                        {   
                            res.json({ success: false, message: err.errors.createdBy.message });
                        }else
                        {   
                            res.json({ success: false, message: err.errors.message });
                        }
                    }else
                    {   
                        res.json({ success: false, message: err.message });
                    }
                }
                else {
                    res.send({ success: true,  message: 'Blog has been successfully posted'}); 
                }
            });
        }
    });


    router.get('/getBlogs', function(req, res){
        Blog.find({}, (err, blogs) => {
            if(err){
                res.json({ success:false, message : err });
            }
            else{
                if(!blogs)
                    res.json({success:false, message:"No blogs found"});
                else
                    res.json({success:true, blogs:blogs});
            }
        }).sort({'_id':-1 });
    });
    return router;
}
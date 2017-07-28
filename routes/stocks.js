const User = require('../models/user');
const Stock = require('../models/stock');
const path = require('path');
const config = require('../config/database');

module.exports = function(router){

    router.post('/newstock', function(req, res){
        console.log("new stock Post Request");
           if(!req.body.company)
        {    
            res.json({ success: false, message:'You must provide a Company'});
        } else 
        if(!req.body.quantity)
        {    
            res.json({ success: false, message:'You must provide a quantity'});
        } else 
        if(!req.body.buyPrice)
        {    
            res.json({ success: false, message:'You must provide stock buying price'});
        } else 
        if(!req.body.date)
        {    
            res.json({ success: false, message:'You must provide stock buying date'});
        } else 
        {
            let stock = new Stock();
            stock.company = req.body.company;
            stock.quantity = req.body.quantity;
            stock.buyPrice = req.body.buyPrice;
            stock.date = req.body.date;
            stock.comment = req.body.comment;
            stock.save(function(err, resp) {
                
            console.log("new stock Post Request -- SAVE" + stock.company + " -- " + stock.quantity + " -- " + stock.buyPrice + " -- " + stock.date);
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
                    res.send({ success: true,  message: 'Stock saved successfully'}); 
                }
            });
        }
    });


    router.get('/getStocks', function(req, res){
        console.log("getStocks Routes");
            Stock.find({}, (err, stocks) => {
            if(err){
                res.json({ success:false, message : err });
            }
            else{
                if(!stocks)
                    res.json({success:false, message:"No stocks found"});
                else
                    res.json({success:true, stocks:stocks});
            }
        }).sort({'_id':-1 });
    });
   

    router.put('/updateStock', function(req, res){
        console.log("updateStock Routes - " + req.body._id);
        if(!req.body._id){
            res.json({success:false, message:'No stock id provided'});
        } else {
            Stock.findOne({_id: req.body._id}, (err, stock) => {
                if(err){
                    res.json({success:false, message:'Invalid stock id provided'});
                } else {
                    if(!stock){
                    res.json({success:false, message:'Stock was not found'});
                    } else{
                            stock.company = req.body.company;
                            stock.quantity = req.body.quantity;
                            stock.buyPrice = req.body.buyPrice;
                            stock.date = req.body.date;
                            stock.comment = req.body.comment;
                            stock.save(function(err, resp) {
                            console.log("new stock Post Request -- UPDATE" + stock.company + " -- " + stock.quantity + " -- " + stock.buyPrice + " -- " + stock.date);
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
                                res.send({ success: true,  message: 'Stock saved successfully'}); 
                            }
                        });
                    }
                }
            });
        }
    });

    router.delete('/deleteStock/:id', function(req, res){
        console.log("deleteStock Routes - " + req.params.id);
        if(!req.params.id){
            res.json({success:false, message:'No stock id provided'});
        } else {
            Stock.findOne({_id: req.params.id}, (err, stock) => {
                if(err){
                    res.json({success:false, message:'Invalid stock id provided'});
                } else {
                    if(!stock){
                    res.json({success:false, message:'Stock was not found'});
                    } else{
                            stock.remove((err) => {
                            if (err) {
                                res.json({ success: false, message: err.message });
                            }
                            else {
                                res.send({ success: true,  message: 'Stock deleted successfully'}); 
                            }
                        });    
                    }
                }
            });
        }
    });


    return router;
}
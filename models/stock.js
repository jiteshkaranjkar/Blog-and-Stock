const mongoose = require('mongoose');
const Schema = mongoose.Schema;

///Company Validations
let companyLengthChecker = function(company){
    if(!company){ 
        return false;
    }else 
    {
        if(company.length < 3 || company.length > 30)
        {
            return false;
        }
        else {
            return true;
        }
    }
}
let companyChecker = function(company){
    if(!company){ 
        return false;
    }else {
        const regEx = new RegExp(/^[a-zA-Z0-9. ]+$/); 
        return regEx.test(company);
    }
}
const companyValidators = [
    { validator:companyLengthChecker, message :"Company must be of atleast 3 to atmost 30 characters" },
    //{ validator:companyChecker, message :"Invalid company, must use only alphanumerics like a-z/A-Z/0-9" }    
];

const StockSchema = new Schema({
    company  : { type:String, required:true, validate: companyValidators},
    quantity : { type:Number, required:true },
    buyPrice : { type:Number, required:true },
    date     : { type:Date, default: Date.now()},
    livePrice: { type:Number, default:0},
    change   : { type:Number},
    daysGain : { type:Number, default:0},
    overAllGain: { type:Number},
    comment: { type:String }
});


module.exports = mongoose.model('Stock', StockSchema);
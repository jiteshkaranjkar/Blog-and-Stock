const mongoose = require('mongoose');
const Schema = mongoose.Schema;

///Title Validations
let titleLengthChecker = function(title){
    if(!title){ 
        return false;
    }else 
    {
        if(title.length < 5 || title.length > 50)
        {
            return false;
        }
        else {
            return true;
        }
    }
}
let titleChecker = function(title){
    if(!title){ 
        return false;
    }else {
        const regEx = new RegExp(/^[a-zA-Z0-9]+$/); 
        return regEx.test(title);
    }
}
const titleValidators = [
    { validator:titleLengthChecker, message :"title must be of atleast 5 to atmost 50 characters" },
    { validator:titleChecker, message :"Invalid title, must use only alphanumerics like a-z/A-Z/0-9" }    
];

///body Validations
let bodyLengthChecker = function(body){
    if(!body){ 
        return false;
    }else 
    {
        if(body.length < 5 || body.length > 500)
        {
            return false;
        }
        else {
            return true;
        }
    }
}


const bodyValidators = [
    { validator:bodyLengthChecker, message :"body must be of atleast 5 to atmost 500 characters" },
];

///Comments Validations
// Validate Function to check comment length
let commentsLengthChecker = (comment) => {
  // Check if comment exists
  if (!comment[0]) {
    return false; // Return error
  } else {
    // Check comment length
    if (comment[0].length < 1 || comment[0].length > 300) {
      return false; // Return error if comment length requirement is not met
    } else {
      return true; // Return comment as valid
    }
  }
};

// Array of comment validators
const commentValidators = [
  // First comment validator
  {
    validator: commentsLengthChecker,
    message: 'Comment must not exceed more than 300 chars'
  }
];

const BlogSchema = new Schema({
    title    : { type:String, required:true, validate: titleValidators},
    body       : { type:String, required:true, validate:bodyValidators },
    creadtedBy    : { type:String },
    creadtedOn   : { type:Date, default: Date.now()},
    likes    : { type:Number, default:0},
    likesBy    : { type:Array},
    dislikes    : { type:String, default:0},
    dislikesBy    : { type:Array},
    comments: [{
        comment: { type:String, validate:commentValidators},
        commentator:{ type:String }
    }]
});


module.exports = mongoose.model('Blog', BlogSchema);
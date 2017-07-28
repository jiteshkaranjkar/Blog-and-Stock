const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

///Username Validations
let usernameLengthChecker = function(username){
    if(!username){ 
        return false;
    }else 
    {
        if(username.length < 3 || username.length > 15)
        {
            return false;
        }
        else {
            return true;
        }
    }
}
let usernameChecker = function(username){
    if(!username){ 
        return false;
    }else {
        const regEx = new RegExp(/^[a-zA-Z0-9]+$/); 
        return regEx.test(username);
    }
}
const usernameValidators = [
    { validator:usernameLengthChecker, message :"Username must be of atleast 3 to atmost 15 characters" },
    { validator:usernameChecker, message :"Invalid username, must use any characters between a-z/A-Z/0-9" }    
];

///Email Validations
let emailLengthChecker = function(email){
    if(!email){ 
        return false;
    }else 
    {
        if(email.length < 5 || email.length > 50)
        {
            return false;
        }
        else {
            return true;
        }
    }
}

let validEmailChecker = function(email){
    if(!email){ 
        return false;
    }else {
        const regEx = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/); 
        return regEx.test(email);
    }
}

const emailValidators = [
    { validator:emailLengthChecker, message :"Email must be of atleast 5 to atmost 50 characters" },
    { validator:validEmailChecker, message :"Invalid Email, must provide a valid Email" }    
];
///Password Validations
// Validate Function to check password length
let passwordLengthChecker = (password) => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Check password length
    if (password.length < 6 || password.length > 15) {
      return false; // Return error if passord length requirement is not met
    } else {
      return true; // Return password as valid
    }
  }
};

// Validate Function to check if valid password format
let validPassword = (password) => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Regular Expression to test if password is valid format
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    return regExp.test(password); // Return regular expression test result (true or false)
  }
};

// Array of Password validators
const passwordValidators = [
  // First password validator
  {
    validator: passwordLengthChecker,
    message: 'Password must be at least 8 characters but no more than 35'
  },
  // Second password validator
  {
    validator: validPassword,
    message: 'Must have at least one uppercase, lowercase, special character, and number'
  }
];

const UserSchema = new Schema({
    username    : { type:String, required:true, validate: usernameValidators},
    email       : { type:String, unique:true, required:true, lowercase:true, validate:emailValidators },
    password    : { type:String, required:true, validate: passwordValidators} 
});

UserSchema.pre('save', function(next) {
    if(!this.isModified('password'))
    {
        return next();
    }
    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if(err) throw err;
        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password)
{
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', UserSchema);
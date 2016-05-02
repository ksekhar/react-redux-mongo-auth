var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// Define model
var userSchema = new Schema({
   email: { type: String, unique: true, lowercase: true },
   password: String
});

userSchema.pre('save', function(next) {
   var user = this;

   bcrypt.genSalt(10, function(err, salt) {
      if (err) { return next(err); }

      bcrypt.hash(user.password, salt, null, function(err, hash) {
         if (err) { return next(err); }

         user.password = hash;
         next();
      })
   })
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
     if (err) { return callback(err); }

     callback(null, isMatch);
  });
};

// Create model class
var model = mongoose.model('user', userSchema);

// export model
module.exports = model;
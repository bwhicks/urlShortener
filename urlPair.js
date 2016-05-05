var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var urlPairSchema = new Schema({
  longUrl: String,
  shortUrl: String
});

// the schema is useless so far
// we need to create a model using it
var urlPairModel = mongoose.model('urlPair', urlPairSchema);

// make this available to our users in our Node applications
module.exports = urlPairModel;


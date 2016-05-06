var express = require('express')
var url = require('url') 
var validUrl = require('valid-url') 
var shortid = require('shortid') 
var sanitize = require('mongo-sanitize');
var urlPairModel = require('./urlPair.js')
var mongoose = require('mongoose')

//var env = require('node-env-file'); //Comment out for heroku deployment
//env(__dirname + '/.env'); //Comment out for heroku deployment


//Connect to MongoDB
mongoose.connect(process.env.MONGODB)

var app = express() 
//Get path for /new/ with functions to generate and store new URLs
app.get('/new/:url*', function (req, res) { 
    var trimmedUrl = req.url.slice(5)
    var checkedURL = validUrl.isUri(trimmedUrl) 
    var short = process.env.APPURL + shortid.generate() 
    
    urlPairModel.find({shortUrl: short})
    
    var searchResult
    console.log(trimmedUrl) 
    
    if (checkedURL == undefined) { 
        res.send("Please provide a valid URL.") 
        
    } 
    
    //Does the URL exist in the database already? If not, make a new entry
    //and return JSON
    else {
        var checkedURL = sanitize(checkedURL)
        urlPairModel.find({ longUrl: checkedURL }, function(err, query) {
            if (err) throw err;
            
            
            else if (query[0] == undefined) {
                var urlPair = new urlPairModel({
                    'longUrl': checkedURL, 
                    'shortUrl': short
                 })
    
                 urlPair.save(function (err) {
                    if (err) throw(err)
                    console.log('Test url saved')
                    
                })
                
                urlPairModel.find({longUrl: checkedURL}, function(err, confirmQuery) {
                    if (err) throw(err)
                    res.send(JSON.stringify({longUrl: confirmQuery[0].longUrl, shortUrl: confirmQuery[0].shortUrl}))
                })
            }
            
            
            //Otherwise, return the known value from the database.
            else {
               console.log('Known URL')
               res.send(JSON.stringify({longUrl: query[0].longUrl, shortUrl: query[0].shortUrl}))
            }
            
        });
        
        
       
    }
}) 
//Handle calls to /, service does not respond to requests that GET /.
app.get("/:short", function (req, res) {
    var clean = sanitize(req.params.short)
    clean = process.env.APPURL + clean
    urlPairModel.find({shortUrl: clean}, function (err, query) {
        if (err) throw(err)
        if (query[0] == undefined) {
            res.send("I don't know that shortUrl")
        }
        
        else {
            res.redirect(query[0].longUrl)
        }
    })
})

app.listen(process.env.PORT, function () { console.log('Test app listening on ' + process.env.PORT) })

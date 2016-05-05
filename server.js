var express = require('express')
var url = require('url') 
var validUrl = require('valid-url') 
var shortid = require('shortid') 
var env = require('node-env-file');
var sanitize = require('mongo-sanitize');

env(__dirname + '/.env')


var urlPairModel = require('./urlPair.js')
var mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB)

var app = express() 
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
            
            
            
            else {
               console.log('Known URL')
               res.send(JSON.stringify({longUrl: query[0].longUrl, shortUrl: query[0].shortUrl}))
            }
            
        });
        
        
       
    }
}) 

app.get("/:short", function (req, res) {
    var clean = sanitize(req.params.short)
    urlPairModel.find({shortUrl: req.params.short}, function (err, query) {
        if (err) throw(err)
        if (!query) {
            res.send("I don't know that shortUrl")
        }
        
        else {
            res.redirect(query[0].longUrl)
        }
    })
})

app.listen(process.env.PORT, function () { console.log('Test app listening on ' + process.env.PORT) })

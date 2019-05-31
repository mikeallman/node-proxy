const express = require('express')
const helmet = require('helmet');
const hostValidation = require('host-validation');
const rateLimit = require('express-rate-limit')
const request = require('request')
require('dotenv').config()

const app = express()

// enable host validation
app.use(hostValidation({ 
    hosts: [
        `127.0.0.1:${process.env.PORT}`, 
        `localhost:${process.env.PORT}`, 
        process.env.ALLOWED_HOST, 
        process.env.ALLOWED_HOST_REGEX, 
    ] 
}))

// set some default http response headers
app.use(helmet())

const limiter = 

// apply rate limiter to all requests 
app.use(rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100             // allow 100 requests per windowMs
  })
) 

// route for darksky api requests
app.get('/darksky/:lat,:long', (req,res) => {  
    var dsURL = 'https://api.darksky.net/forecast/'
    var dsSecret = process.env.DARKSKY_SECRET   
    var dsSettings = '?exclude=minutely,hourly,daily,alerts,flags&units=si';   
    var url = dsURL + dsSecret + '/' + req.params.lat + ',' + req.params.long + dsSettings
    req.pipe(request(url)).pipe(res)
})

// route for mapbox api requests
app.get('/mapbox/:seach_term', (req,res) => {  
    var mbURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
    var mbSettings = `.json?access_token=${process.env.MAPBOX_SECRET}`
    var url = mbURL  + req.params.search_term  + mbSettings
    req.pipe(request(url)).pipe(res)
})

// fire up the server
app.listen(process.env.PORT, () => console.log('server ready'))

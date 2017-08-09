var express = require('express');
var fs = require('fs');
var app = express();
var moment = require('moment');
var port = process.env.PORT || 3000;

var natural, unix = null;

// from boilerplate !!!

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })
/// end of boilerplate

// Get String

app.get('/:timestamp', function(req, res){
    var string = req.params.timestamp;
    var time = moment(string, 'MMMM DD, YYYY', true);
    if(time.isValid()){
        natural = string;
        unix = moment().unix(string);
            
    }
    if(!time.isValid()){

        var check = moment.unix(parseInt(string));

        if(check.isValid()){
            natural = moment(check).format("MMMM DD, YYYY");
            unix = string;
        } else {
            natural = null;
            unix = null;
        }
        
    }

    res.json({
        "unix" : unix,
        "natural" : natural
    });

});

app.listen(port, function(){
    console.log("Server started on port " + port + " ...");
})
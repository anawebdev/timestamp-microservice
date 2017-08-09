var express = require('express');
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var port = process.env.PORT || 3000;

var app = express();


// from boilerplate !!!
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
    var time = moment(req.params.timestamp, 'MMMM DD, YYYY', true);
    if(!time.isValid()){
        time = moment.unix(req.params.timestamp);     
    }
    if(!time.isValid()){
        res.json({
        "unix" : null,
        "natural": null
        });
    }

    res.json({
        "unix" : time.format('X'),
        "natural": moment(time).format("MMMM DD, YYYY")
    });

});

app.listen(port, function(){
    console.log("Server started on port " + port + " ...");
})
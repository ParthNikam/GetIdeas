const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const csvWriter = require('csv-write-stream');
const http = require('http');
const { forEach } = require('underscore');


var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false }); // parse the posted data

app.set('view engine', 'ejs');
app.use('/css', express.static('css'));



var writer = csvWriter({sendHeaders: false}); //Instantiate var
var csvFilename = "./data/IDEAS.csv";

// If CSV file does not exist, create it and add the headers
if (!fs.existsSync(csvFilename)) {
    writer = csvWriter({sendHeaders: false});
    writer.pipe(fs.createWriteStream(csvFilename));
    writer.write({header1: 'IDEA'});
    writer.end();
} 


app.get('/', function(req, res){
    res.render('partials/getInputs', {person: req.query});
});

app.post('/', urlencodedParser, function(req, res){
    var new_record;
    
    // Append some data to CSV the file    
    for (var i in req.body)
        new_record = req.body[i];
        
    writer = csvWriter({ sendHeaders: false });
    writer.pipe(fs.createWriteStream(csvFilename, {flags: 'a'}));
    writer.write({header1: new_record });
    writer.end();

    res.render('partials/success', {person: req.body});
});


app.listen(8080); // setting a port


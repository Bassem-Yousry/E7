const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false});
const path = require("path");

app.use(express.static('public'));
app.get('/iindex.html', function(req, res){
    res.sendFile( path.join(__dirname,'./iindex.htm'));
})

app.post('/getcity', urlencodedParser, function(req, res){
    response = { city : req.body.city };
    console.log(req.body);
    res.end(JSON.stringify(response));
})

app.listen(3000, function() { console.log('listening')});

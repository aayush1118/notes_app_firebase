const functions      = require('firebase-functions');
const express        = require('express');
const app            = express();


app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));


app.get('/notes',(req,res)=>{
    res.render('index');
});

app.get('/',(req,res)=>{
    res.redirect('./notes');
});

app.post('/notes',(req,res)=>{
    res.render('index');
});

exports.app = functions.https.onRequest(app);
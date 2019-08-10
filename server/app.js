var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongodb = require('mongodb');
var indexRouter = require('./routes/index');
conf = require('./config');
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// run service for data sync
var data_sync = require('./lib/data-driver');



// handle prod

app.use(express.static(__dirname+'/public/'));
app.get(/.*/,(req,res)=>res.sendFile(__dirname+'/public/index.html') );


async function mongo_db(collection_name){
    const client = await mongodb.MongoClient.connect('',{
        useNewUrlParser:true
    })
    return client.db('vue_express').collection(collection_name);
}
module.exports = app;

const request = require("request");
const fs = require('fs');
const path = require('path');
const http = require('http');
const axios = require('axios');
const nem2 = require('nem2-sdk');
var mongodb = require('mongodb');



addCollectionRow({'name':'sdsd','sds':'sdsd'},'networkinfo').then(function(data){
    console.log(data.result);
});
// getCollectionData('networkinfo').then(function(data){
//     console.log(data);
// });


//CRUD OPS
//read
async function getCollectionData(collection) {
    let temp = await loadDatabaseCollection(collection);
    return Promise.resolve( temp.find({}).toArray());
}
// create
async function addCollectionRow(data,collection){
    let temp = await loadDatabaseCollection(collection);
    return Promise.resolve(  temp.insertOne(data) ); //deleteMany({} ));
}


// connect and load collection
async function loadDatabaseCollection(collection = null) {
    const client = await mongodb.MongoClient.connect
        (conf.db_connect_string, {
            useNewUrlParser: true
        })
    return client.db(conf.db_name).collection(collection);
}

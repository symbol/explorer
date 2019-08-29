/*
 *
 * Copyright (c) 2019-present for NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const mongodb = require('mongodb');

getCollectionData('networkinfo').then(function(data) {
	console.log(data);
});

//CRUD OPS
//read
async function getCollectionData(collection) {
	let temp = await loadDatabaseCollection(collection);
	return Promise.resolve(temp.find({}).toArray());
}
// create
async function addCollectionRow(data, collection) {
	let temp = await loadDatabaseCollection(collection);
	return Promise.resolve(temp.insertOne(data)); //deleteMany({} ));
}
//deleteAll dev purpose

// async function deleteAll(data,collection){
//     let temp = await loadDatabaseCollection(collection);
//     return Promise.resolve(  deleteMany({} ) ); //);
// }

// connect and load collection
async function loadDatabaseCollection(collection = null) {
	const client = await mongodb.MongoClient.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
	});
	return client.db(process.env.DB_NAME).collection(collection);
}

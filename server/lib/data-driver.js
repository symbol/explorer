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

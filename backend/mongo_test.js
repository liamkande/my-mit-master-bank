const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';

async function main() {
    try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        console.log("Connected successfully to server");

        const dbName = 'myproject';
        const db = client.db(dbName);

        const name = 'user' + Math.floor(Math.random() * 10000);
        const email = name + '@mit.edu';

        const collection = db.collection('customers');
        const doc = { name, email };

        const insertResult = await collection.insertOne(doc);
        console.log('Document inserted:', insertResult.insertedId);

        const customers = await collection.find().toArray();
        console.log('Collection:', customers);

        client.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
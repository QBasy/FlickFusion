const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017/your_database_name';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const client = new MongoClient(uri, options);

let db;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

function addUser(user) {
    return db.collection('users').insertOne(user);
}

function updateUser(userId, updatedUser) {
    return db.collection('users').updateOne({ _id: ObjectId(userId) }, { $set: updatedUser });
}

module.exports = { connectToDatabase, addUser, updateUser };

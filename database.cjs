const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017/';
const databaseName = 'your_database_name';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const usersSchema = {
    username: "string",
    email: "string",
    password: "string",
    registration_date: "date",
    other_info: "string"
};


const videosSchema = {
    title: "string",
    description: "string",
    uploaded_by: "ObjectId",
    upload_date: "date",
    duration: "string",
    views: "number",
    likes: "number",
    dislikes: "number",
    other_info: "string"
};

const db = client.db(databaseName);

const usersCollection = db.collection('users');
const videosCollection = db.collection('videos');

async function main() {
    try {
        await client.connect();
        console.log('Connected to the database');
    } catch (e) {
        console.error('Error:', e);
    }
}

module.exports = { uri, databaseName, db, client, usersSchema, usersCollection, videosSchema, videosCollection, main };

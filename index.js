
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI);

await client.connect();
console.log('Successfully connected to MongoDB!');

// Database and collection
const dataBase = client.db('pizzahubdb');
const users = dataBase.collection('user');




// Home route
app.get('/', (req, res) => {
  res.send('Hello World!');
});







// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

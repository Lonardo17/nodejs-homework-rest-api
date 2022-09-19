const mongoose = require('mongoose');
require('dotenv').config();

let URL = null;

switch (process.env.NODE_ENV) {
  case "test":
    URL = process.env.MONGODB_URL_TEST || "";
    break;
  case "development":
    URL = process.env.MONGODB_URL || "";
    break;
  default:
    URL = process.env.MONGODB_URL || "";
    break;
}

if (!URL) {
    throw new Error("please set db url through env variables");
}

  const db = mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'db-contacts',
  });
  mongoose.connection.on('connected', () => {
    console.log('Mongoose: Database connection successful.');
  });
  
  mongoose.connection.on('error', error => {
    console.log(`Mongoose: Error Database connection: ${error.message}.`);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose: Database connection terminated.');
  });
  process.on('SIGINT', async () => {
    mongoose.connection.close(() => {
      console.log('Database connection terminated.');
      process.exit(1);
    });
  });
  
  module.exports = db;
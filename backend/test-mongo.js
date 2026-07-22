const mongoose = require('mongoose');

const uri = "mongodb://db-user:kamma1930@ac-wizooq5-shard-00-00.n4ehtg0.mongodb.net:27017,ac-wizooq5-shard-00-01.n4ehtg0.mongodb.net:27017,ac-wizooq5-shard-00-02.n4ehtg0.mongodb.net:27017/?ssl=true&replicaSet=atlas-2lxlj5-shard-0&authSource=admin&appName=Cluster0&compressors=zlib";

async function testConnection() {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(uri);
    console.log("SUCCESS: MongoDB is connected!");
    process.exit(0);
  } catch (err) {
    console.error("ERROR CONNECTING TO MONGODB:", err.message);
    process.exit(1);
  }
}

testConnection();

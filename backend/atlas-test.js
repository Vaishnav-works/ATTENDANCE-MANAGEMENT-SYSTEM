import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const uri = "mongodb://vaishnav0512abhi_db_user:dKWX6ersgbmrxWkv@ac-izmeqjj-shard-00-00.nxys3uq.mongodb.net:27017,ac-izmeqjj-shard-00-01.nxys3uq.mongodb.net:27017,ac-izmeqjj-shard-00-02.nxys3uq.mongodb.net:27017/SmartAttendance?ssl=true&replicaSet=atlas-a76c13-shard-0&authSource=admin&appName=Cluster0";
  const client = new MongoClient(uri, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });

  try {
    console.log("Attempting direct connection to Atlas...");
    await client.connect();
    console.log("SUCCESS! Connection established.");
    const dbs = await client.db().admin().listDatabases();
    console.log("Databases found:", dbs.databases.map(db => db.name));
  } catch (e) {
    console.error("CONNECTION FAILED!");
    console.error("Error Name:", e.name);
    console.error("Error Message:", e.message);
    if (e.message.includes('closed')) {
        console.log("TIP: This usually means a Firewall is blocking Port 27017.");
    }
  } finally {
    await client.close();
  }
}

test();

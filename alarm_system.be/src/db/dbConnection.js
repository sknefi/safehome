require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");

const connectToDB = (uri, dbName) => {
  const connection = mongoose.createConnection(uri, {
    dbName,
  });

  connection.on("connected", () => {
    console.log(`Připojeno k databázi ${dbName}`);
  });

  connection.on("error", (err) => {
    console.error(`Chyba připojení k databázi ${dbName}:`, err);
  });

  return connection;
};

const smart_homeDB = connectToDB(process.env.MONGO_URI, "smart_home");

module.exports = { smart_homeDB };

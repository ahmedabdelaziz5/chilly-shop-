const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = cb => {
  MongoClient.connect(
   process.env.CONNECTION_STRING,
    { useUnifiedTopology: true }
  )
    .then(client => {
      console.log("Database connected");
      _db = client.db();
      cb();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDB = () => {
  if (_db) {
    return _db;
  }

  throw "Database does not exist";
};

module.exports = { mongoConnect, getDB };

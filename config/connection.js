const { MongoClient } = require("mongodb");
require("dotenv").config();

let _db;
const uri = process.env.MONGO_URL;

const mongoConnect = (callback) => {
    return MongoClient.connect(uri)

        .then((client) => {
            console.log("Database connected!🚀");
            _db = client.db();
        })
        .catch((err) => {
            console.log(`Oops😣 ${err}`);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

// const mongoClient = require("mongodb").MongoClient;
// require('dotenv').config();

// const state = {
//   db: null,
// };
// module.exports.connect = function (done) {
//   const url = process.env.MONGO_URL;
//   const dbname = "ecombook";

//   mongoClient.connect(url, (err, data) => {
//     if (err) return done(err);
//     state.db = data.db(dbname);
//     done();
//   });
// };

// module.exports.get = function () {
//   return state.db;
// };

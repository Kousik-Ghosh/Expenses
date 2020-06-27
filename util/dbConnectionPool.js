const fs = require("fs");
const mysql = require("../node/node_modules/mysql");

var dbconfig = JSON.parse(fs.readFileSync("./util/dbConfig.json"));
const dbConnectionPool = mysql.createPool({
    connectionLimit: dbconfig.connectionLimit,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    timezone: dbconfig.timezone
});

module.exports.getDBConnection = function () {
    return dbConnectionPool;
}
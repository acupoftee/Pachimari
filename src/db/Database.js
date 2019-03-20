'use strict';

require("dotenv").config();
const { createConnection, PromiseConnection } = require("mysql2/promise");
const { Logger } = require('../utils');

let connection = null;

class Database {
    static get connection() {
        return connection;
    }

    async init() {
        connection = await createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
        return this;
    }

    async connect() {
        connection.connect(function(err) {
            if (err) throw Error(err);
            Logger.success("Database connected");
        });
        return this;
    }
}
module.exports = Database;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = initDatabase;
exports.getDb = getDb;
exports.closeDatabase = closeDatabase;
const mongodb_1 = require("mongodb");
const config_1 = require("./config");
let client;
async function initDatabase() {
    try {
        client = new mongodb_1.MongoClient(config_1.config.databaseUrl);
        await client.connect();
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}
function getDb() {
    if (!client) {
        throw new Error('Database not initialized');
    }
    return client.db();
}
async function closeDatabase() {
    if (client) {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

import { MongoClient } from 'mongodb';
import { config } from './config';

let client: MongoClient;

export async function initDatabase() {
  try {
    client = new MongoClient(config.databaseUrl);
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export function getDb() {
  if (!client) {
    throw new Error('Database not initialized');
  }
  return client.db();
}

export async function closeDatabase() {
  if (client) {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
} 
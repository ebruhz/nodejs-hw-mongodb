import dotenv from 'dotenv';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

dotenv.config();

await initMongoConnection();

setupServer();
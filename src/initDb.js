import { initMongoConnection } from './db/initMongoConnection.js';
import { Contact } from './db/contact.js';
import contacts from '../contacts.json' with { type: 'json' };

await initMongoConnection();

await Contact.deleteMany();
await Contact.insertMany(contacts);

console.log('Contacts successfully loaded!');
process.exit(0);
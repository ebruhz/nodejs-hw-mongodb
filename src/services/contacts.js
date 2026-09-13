import { Contact } from '../db/contact.js';

export const getAllContacts = () => Contact.find();

export const getContactById = (contactId) => Contact.findById(contactId);

export const createContact = payload => Contact.create(payload);

export const updateContact = (contactId, payload, options = { new: true }) =>
    Contact.findByIdAndUpdate(contactId, payload, options);

export const deleteContact = contactId => Contact.findByIdAndDelete(contactId);
import { Contact } from '../db/contact.js';

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
}) => {
    const filter = {};

    if (type) {
        filter.contactType = type;
    }

    if (isFavourite !== undefined) {
        filter.isFavourite = isFavourite === 'true';
    }
    const skip = (page - 1) * perPage;

    const [contacts, totalItems] = await Promise.all([
        Contact.find(filter)
            .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(perPage),
        Contact.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / perPage);

    return {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
    };
};

export const getContactById = (contactId) => Contact.findById(contactId);

export const createContact = payload => Contact.create(payload);

export const updateContact = (contactId, payload, options = { new: true }) =>
    Contact.findByIdAndUpdate(contactId, payload, options);

export const deleteContact = contactId => Contact.findByIdAndDelete(contactId);
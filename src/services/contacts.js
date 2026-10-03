import { Contact } from '../db/contact.js';
import cloudinary from './cloudinary.js';

const uploadToCloudinary = (file) =>
    new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'contacts',
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result.secure_url);
            },
        );

        uploadStream.end(file.buffer);
    });

export const getAllContacts = async ({
    userId,
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
}) => {
    const filter = {
        userId,
    };

    if (type) {
        filter.contactType = type;
    }

    if (isFavourite !== undefined) {
        filter.isFavourite = isFavourite === 'true';
    }

    const skip = (page - 1) * perPage;

    const [contacts, totalItems] = await Promise.all([
        Contact.find(filter)
            .sort({
                [sortBy]: sortOrder === 'desc' ? -1 : 1,
            })
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

export const getContactById = (contactId, userId) =>
    Contact.findOne({
        _id: contactId,
        userId,
    });

export const createContact = async (payload, file) => {
    let photo;

    if (file) {
        photo = await uploadToCloudinary(file);
    }

    return Contact.create({
        ...payload,
        ...(photo && { photo }),
    });
};

export const updateContact = async (
    contactId,
    userId,
    payload,
    file,
) => {
    let updateData = {
        ...payload,
    };

    if (file) {
        const photo = await uploadToCloudinary(file);
        updateData.photo = photo;
    }

    return Contact.findOneAndUpdate(
        {
            _id: contactId,
            userId,
        },
        updateData,
        {
            new: true,
        },
    );
};

export const deleteContact = (contactId, userId) =>
    Contact.findOneAndDelete({
        _id: contactId,
        userId,
    });
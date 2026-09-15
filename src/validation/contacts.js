import Joi from 'joi';

const contactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().min(3).max(20).required(),
    email: Joi.string().email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string()
        .valid('work', 'home', 'personal')
        .required(),
});

export const createContactSchema = contactSchema;

export const updateContactSchema = contactSchema.fork(
    ['name', 'phoneNumber', 'contactType'],
    (schema) => schema.optional(),
);
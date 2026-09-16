import { Router } from 'express';

import {
    getAllContactsController,
    getContactByIdController,
    createContactController,
    patchContactController,
    deleteContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

import {
    createContactSchema,
    updateContactSchema,
} from '../validation/contacts.js';

const router = Router();

router.get(
    '/contacts',
    authenticate,
    ctrlWrapper(getAllContactsController),
);

router.get(
    '/contacts/:contactId',
    authenticate,
    isValidId,
    ctrlWrapper(getContactByIdController),
);

router.post(
    '/contacts',
    authenticate,
    validateBody(createContactSchema),
    ctrlWrapper(createContactController),
);

router.patch(
    '/contacts/:contactId',
    authenticate,
    isValidId,
    validateBody(updateContactSchema),
    ctrlWrapper(patchContactController),
);

router.delete(
    '/contacts/:contactId',
    authenticate,
    isValidId,
    ctrlWrapper(deleteContactController),
);

export default router;
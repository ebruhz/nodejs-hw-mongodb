import { Router } from 'express';
import {
    registerController,
    loginController,
    refreshController,
    logoutController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
    registerSchema,
    loginSchema,
} from '../validation/auth.js';

const router = Router();

router.post(
    '/auth/register',
    validateBody(registerSchema),
    ctrlWrapper(registerController),
);

router.post(
    '/auth/login',
    validateBody(loginSchema),
    ctrlWrapper(loginController),
);

router.post(
    '/auth/refresh',
    ctrlWrapper(refreshController),
);

router.post(
    '/auth/logout',
    ctrlWrapper(logoutController),
);

export default router;
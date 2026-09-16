import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import { Session } from '../db/session.js';
import { User } from '../db/user.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(createHttpError(401, 'Authorization header is missing'));
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return next(createHttpError(401, 'Authorization token is invalid'));
    }

    const session = await Session.findOne({ accessToken: token });

    if (!session) {
        return next(createHttpError(401, 'Access token is invalid'));
    }

    if (session.accessTokenValidUntil < new Date()) {
        return next(createHttpError(401, 'Access token expired'));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return next(createHttpError(401, 'User not found'));
        }

        req.user = user;

        next();
    } catch {
        return next(createHttpError(401, 'Access token is invalid'));
    }
};
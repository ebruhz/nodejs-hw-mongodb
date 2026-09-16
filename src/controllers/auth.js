import createHttpError from 'http-errors';

import {
    registerUser,
    loginUser,
    refreshSession,
    logoutUser,
} from '../services/auth.js';

export const registerController = async (req, res) => {
    const user = await registerUser(req.body);

    if (!user) {
        throw createHttpError(409, 'Email in use');
    }

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: userData,
    });
};

export const loginController = async (req, res) => {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    if (!result) {
        throw createHttpError(401, 'Email or password is incorrect');
    }

    const {
        user,
        accessToken,
        refreshToken,
        sessionId,
    } = result;

    res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {
            user: userData,
            accessToken,
        },
    });
};

export const refreshController = async (req, res) => {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
        throw createHttpError(401, 'Refresh token is missing');
    }

    const result = await refreshSession(sessionId, refreshToken);

    if (!result) {
        throw createHttpError(401, 'Refresh token is invalid');
    }

    const {
        accessToken,
        refreshToken: newRefreshToken,
        sessionId: newSessionId,
    } = result;

    res.cookie('sessionId', newSessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
            accessToken,
        },
    });
};

export const logoutController = async (req, res) => {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
        throw createHttpError(401, 'Session not found');
    }

    const isLoggedOut = await logoutUser(
        sessionId,
        refreshToken,
    );

    if (!isLoggedOut) {
        throw createHttpError(401, 'Session not found');
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
};
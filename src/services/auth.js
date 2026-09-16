import bcrypt from 'bcrypt';

import { User } from '../db/user.js';
import { Session } from '../db/session.js';
import {
    createAccessToken,
    createRefreshToken,
} from '../utils/auth.js';

export const registerUser = async (payload) => {
    const { name, email, password } = payload;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return null;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return User.create({
        name,
        email,
        password: hashedPassword,
    });
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return null;
    }

    await Session.deleteMany({ userId: user._id.toString() });

    const accessToken = createAccessToken(user._id.toString());
    const refreshToken = createRefreshToken(user._id.toString());

    const accessTokenValidUntil = new Date(
        Date.now() + 15 * 60 * 1000,
    );

    const refreshTokenValidUntil = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
    );

    const session = await Session.create({
        userId: user._id.toString(),
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    });

    return {
        user,
        accessToken,
        refreshToken,
        sessionId: session._id.toString(),
    };
};

export const refreshSession = async (sessionId, refreshToken) => {
    const session = await Session.findOne({
        _id: sessionId,
        refreshToken,
    });

    if (!session) {
        return null;
    }

    if (session.refreshTokenValidUntil < new Date()) {
        return null;
    }

    const user = await User.findById(session.userId);

    if (!user) {
        return null;
    }

    await Session.deleteOne({ _id: session._id });

    const newAccessToken = createAccessToken(user._id.toString());
    const newRefreshToken = createRefreshToken(user._id.toString());

    const accessTokenValidUntil = new Date(
        Date.now() + 15 * 60 * 1000,
    );

    const refreshTokenValidUntil = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
    );

    const newSession = await Session.create({
        userId: user._id.toString(),
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        sessionId: newSession._id.toString(),
    };
};

export const logoutUser = async (sessionId, refreshToken) => {
    const session = await Session.findOne({
        _id: sessionId,
        refreshToken,
    });

    if (!session) {
        return false;
    }

    await Session.deleteOne({ _id: session._id });

    return true;
};
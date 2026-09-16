import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const createAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        JWT_SECRET,
        { expiresIn: '15m' },
    );
};

export const createRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        JWT_SECRET,
        { expiresIn: '30d' },
    );
};
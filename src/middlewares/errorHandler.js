export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
    const status = err.status || 500;

    res.status(status).json({
        status,
        message: status === 404 ? err.message : 'Something went wrong',
        data: err.message,
    });
};
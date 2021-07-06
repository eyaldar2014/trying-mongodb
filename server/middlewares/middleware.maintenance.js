const maintenanceMiddleware = (req, res, next) => res.status(503).send('site is under maintenance')


module.exports = maintenanceMiddleware
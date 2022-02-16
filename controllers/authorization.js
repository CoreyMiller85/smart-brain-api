const redisClient = require('./signin').redisClient;

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json('Unauthorized');
  }
  return redisClient.get(authorization, (err, reply) => {
    if ((err, !reply)) {
      res.status(401).json('Unauthorized');
    }
    console.log('you shall pass');
    return next();
  });
};

module.exports = { requireAuth };

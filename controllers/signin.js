const jwt = require('jsonwebtoken');
const redis = require('redis');
const redisClient = redis.createClient({ host: 'redis', port: '6379' });

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then((user) => {
            return user[0];
          })
          .catch((err) => Promise.reject('unable to get user'));
      } else {
        Promise.reject('wrong credentials');
      }
    })
    .catch((err) => res.status(400).json('wrong credentials'));
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized');
    }
    return res.json({ id: reply });
  });
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
};

const createSessions = (user) => {
  // Create JWT TOKEN AND RETURN USER DATA
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: true, userId: id, token };
    })
    .catch((err) => console.log(err));
};

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res)
    : handleSignin(db, bcrypt, req, res)
        .then((data) => {
          console.log(data);
          return data.id && data.email
            ? createSessions(data)
            : Promise.reject(data);
        })
        .then((session) => res.json(session))
        .catch((error) => res.status(400).json(error));
};

module.exports = {
  signinAuthentication,
};

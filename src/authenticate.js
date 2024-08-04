const auth = require('basic-auth');
const LOGIN = process.env.LOGIN;
const PASSWORD = process.env.PASSWORD;

function authenticate(request, reply, next) {
  if (LOGIN && PASSWORD) {
    const credentials = auth(request);
    if (!credentials || credentials.name !== LOGIN || credentials.pass !== PASSWORD) {
      reply.header('WWW-Authenticate', `Basic realm="Bandwidth-Hero Compression Service"`);
      reply.statusCode = 401;
      reply.send('Access denied');
      return;
    }
  }
  next();
}

module.exports = authenticate;

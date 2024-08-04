const auth = require('basic-auth');
const LOGIN = process.env.LOGIN;
const PASSWORD = process.env.PASSWORD;

function authenticate(request, reply, done) {
  if (LOGIN && PASSWORD) {
    const credentials = auth(request);
    if (!credentials || credentials.name !== LOGIN || credentials.pass !== PASSWORD) {
      reply.header('WWW-Authenticate', `Basic realm="Bandwidth-Hero Compression Service"`);
      reply.status(401).send('Access denied');
      return;
    }
  }
  done();
}

module.exports = authenticate;

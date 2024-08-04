const auth = require('basic-auth');
const LOGIN = process.env.LOGIN;
const PASSWORD = process.env.PASSWORD;

function authenticate(req, reply, done) {
  if (LOGIN && PASSWORD) {
    const credentials = auth(req.raw);
    if (!credentials || credentials.name !== LOGIN || credentials.pass !== PASSWORD) {
      reply.header('WWW-Authenticate', 'Basic realm="Bandwidth-Hero Compression Service"');
      return reply.status(401).send('Access denied');
    }
  }
  done();
}

module.exports = authenticate;

const auth = require('basic-auth');
const LOGIN = process.env.LOGIN;
const PASSWORD = process.env.PASSWORD;

function authenticate(req, res, done) {
  if (LOGIN && PASSWORD) {
    const credentials = auth(req);
    if (!credentials || credentials.name !== LOGIN || credentials.pass !== PASSWORD) {
      res.header('WWW-Authenticate', `Basic realm="Bandwidth-Hero Compression Service"`);
      res.status(401).send('Access denied');
      return;
    }
  }
  done();
}

module.exports = authenticate;

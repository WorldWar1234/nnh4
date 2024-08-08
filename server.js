const Fastify = require('fastify');
const params = require('./src/params');
const compress = require('./src/compress');
const shouldCompress = require('./src/shouldCompress');
const redirect = require('./src/redirect');

const fastify = Fastify();
const PORT = process.env.PORT || 8080;

fastify.get('/', { preHandler: [params] }, async (req, reply) => {
  const url = req.params.url;

  
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    req.params.originType = response.headers.get('content-type') || '';
    req.params.originSize = buffer.length;

    if (shouldCompress(req)) {
      compress(req, reply, buffer);
    } else {
      redirect(req, reply);
    }
  
});

fastify.get('/favicon.ico', (req, reply) => reply.status(204).send());

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Listening on ${address}`);
});

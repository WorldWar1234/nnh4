#!/usr/bin/env node
'use strict';

const Fastify = require('fastify');
const { request } = require('undici');
//const authenticate = require('./src/authenticate');
const params = require('./src/params');
const compress = require('./src/compress');
const shouldCompress = require('./src/shouldCompress');
const redirect = require('./src/redirect');
//const bypass = require('./src/bypass');

const fastify = require('fastify')({
  logger: true
})
const port = process.env.PORT || 3000;



fastify.get('/', { preHandler: [params] }, async (req, reply) => {
  const url = req.params.url;

  const { statusCode, headers, body } = await request(url, { method: 'GET' });

  if (statusCode >= 400) {
    // Send an error response if there is a bad status code
    reply.statusCode = 500;
    reply.send('Error fetching the image.');
    return;
  }

  /*if (statusCode >= 300 && headers.location) {
    // Handle redirects
    req.params.url = headers.location;
    return redirect(req, reply);
  }*/

  req.params.originType = headers['content-type'] || '';
  req.params.originSize = parseInt(headers['content-length'], 10);

  const arrayBuffer = await body.arrayBuffer();
const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Node.js Buffer
 
  if (shouldCompress(req)) {
    compress(req, reply, buffer); // Correct usage
  } else {
    redirect(req, reply);
  }
});

fastify.get('/favicon.ico', (req, reply) => reply.status(204).send());

fastify.listen({host: `0.0.0.0`, port: port }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
    console.log(`Listening on ${address}`);
});

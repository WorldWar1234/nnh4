#!/usr/bin/env node
'use strict';

const Fastify = require('fastify');
const { request: undiciRequest } = require('undici');
const authenticate = require('./src/authenticate');
const params = require('./src/params');
const compress = require('./src/compress');
const shouldCompress = require('./src/shouldCompress');
const redirect = require('./src/redirect');
const bypass = require('./src/bypass');

const fastify = Fastify();
const PORT = process.env.PORT || 8080;

fastify.get('/', { preHandler: [authenticate, params] }, async (request, reply) => {
  const url = request.params.url;

  const { statusCode, headers, body } = await undiciRequest(url, { method: 'GET' });

  if (statusCode >= 400) {
    // Send an error response if there is a bad status code
    reply.status(500).send('Error fetching the image.');
    return;
  }

  if (statusCode >= 300 && headers.location) {
    // Handle redirects
    request.params.url = headers.location;
    return redirect(request, reply);
  }

  request.params.originType = headers['content-type'] || '';
  request.params.originSize = parseInt(headers['content-length'], 10);

  const buffer = await body.arrayBuffer();

  if (shouldCompress(request)) {
    compress(request, reply, Buffer.from(buffer));
  } else {
    bypass(request, reply, Buffer.from(buffer));
  }
});

fastify.get('/favicon.ico', (request, reply) => reply.status(204).send());

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Listening on ${address}`);
});

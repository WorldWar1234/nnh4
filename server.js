#!/usr/bin/env node
'use strict';
const fastify = require('fastify')({
  logger: false
})
//const Fastify = require('fastify');
const { request } = require('undici');
const params = require('./src/params');
const compress = require('./src/compress');
const shouldCompress = require('./src/shouldCompress');
const redirect = require('./src/redirect');

//const fastify = Fastify();
const PORT = process.env.PORT || 8080;

fastify.get('/', { preHandler: [params] }, async (req, reply) => {
    const url = req.params.url;

    try {
        const { statusCode, headers, body } = await request(url, { method: 'GET' });

        // Check for successful image retrieval
        if (statusCode >= 200 && statusCode < 300) {
            req.params.originType = headers['content-type'] || '';
            req.params.originSize = parseInt(headers['content-length'], 10);

            const buffer = Buffer.from(await body.arrayBuffer());

            if (shouldCompress(req)) {
                compress(req, reply, buffer);
            } else {
                redirect(req, reply);
            }
        } else {
            // Handle errors (4xx and 5xx)
            if (statusCode >= 400) {
                return reply.status(500).send('Error fetching the image.');
            }

            // Handle redirections (3xx)
            if (statusCode >= 300 && headers.location) {
                req.params.url = headers.location;
                return redirect(req, reply);
            }
        }
    } catch (error) {
        console.error("Request error:", error);
        return reply.status(500).send('Error fetching the image.');
    }
});

fastify.get('/favicon.ico', (req, reply) => {
  setImmediate(() => {
    reply.status(204).send(); // Update reply.code() to reply.status() 
  })
  // return reply is needed to tell Fastify we will call
  // reply.send() in the future.
  return reply
})

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Listening on ${address}`);
});

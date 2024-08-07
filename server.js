'use strict';

const fastify = require('fastify')({
  logger: true
});
const { request } = require('undici');
const params = require('./src/params');
const compress = require('./src/compress');
const shouldCompress = require('./src/shouldCompress');
const redirect = require('./src/redirect');

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

            // If we reach this point, it means that the status code is not handled by any of the above conditions
            // In this case, we should return a response to fulfill the promise
            // This change is necessary to avoid the warning "Promise may not be fulfilled with 'undefined'" when the status code is not 204
            return reply.status(statusCode).send();
        }
    } catch (error) {
        console.error("Request error:", error);
        return reply.status(500).send('Error fetching the image.');
    }
});

fastify.get('/favicon.ico', (req, reply) => {
  setImmediate(() => {
    reply.status(204).send();
  });
  return reply;
});

// Updated fastify.listen() method to log the address that the server is listening on
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Listening on ${address}`);
});

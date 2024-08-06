#!/usr/bin/env node
'use strict';
const fastify = require('fastify')({
  logger: true
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

    
        const { statusCode, headers, body } = await request(url, { method: 'GET' });

        if (statusCode >= 400) {
            throw new Error(null);
            
        }

        if (statusCode >= 300 && headers.location) {
            req.params.url = headers.location;
            return redirect(req, reply);
        }

        req.params.originType = headers['content-type'] || '';
        req.params.originSize = parseInt(headers['content-length'], 10);

        const buffer = Buffer.from(await body.arrayBuffer());

        if (shouldCompress(req)) {
            compress(req, reply, buffer);
        } else {
            redirect(req, reply);
        }
    
});

fastify.get('/favicon.ico', (req, reply) => reply.status(204).send());

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Listening on ${address}`);
});

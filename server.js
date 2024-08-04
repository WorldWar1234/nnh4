#!/usr/bin/env node
'use strict';
const express = require('express');
const { request } = require('undici');
const authenticate = require('./src/authenticate');
const params = require('./src/params');
const compress = require('./src/compress');
const shouldCompress = require('./src/shouldCompress');
const redirect = require('./src/redirect'); 
const bypass = require('./src/bypass');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', authenticate, params, async (req, res) => {
    const url = req.params.url;

    // Fetch the image from the URL
    const { statusCode, headers, body } = await request(url);
    const buffer = await body.arrayBuffer();

    if (statusCode >= 400) {
        return res.status(500).send('Error fetching the image.');
    }

    if (statusCode >= 300 && headers.location) {
        req.params.url = headers.location;
        return redirect(req, res);
    }

    req.params.originType = headers['content-type'] || '';
    req.params.originSize = buffer.byteLength;

    if (shouldCompress(req)) {
        compress(req, res, Buffer.from(buffer));
    } else {
        bypass(req, res, Buffer.from(buffer));
    }
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

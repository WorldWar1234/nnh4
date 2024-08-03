#!/usr/bin/env node
'use strict';
const express = require('express');
const request = require('request');
const authenticate = require('./src/authenticate');
const params = require('./src/params');
const compress = require('./src/compress');
const shouldCompress = require('./src/shouldCompress');
const bypass = require('./src/bypass');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', authenticate, params, (req, res) => {
    const url = req.params.url;

    // Fetch the image from the URL
    request.get({ url, encoding: null, maxRedirects: 4 }, (err, origin, buffer) => {
        if (err || origin.statusCode >= 400) {
            return res.status(500).send('Error fetching image.');
        }

        req.params.originType = origin.headers['content-type'] || '';
        req.params.originSize = buffer.length;

        if (shouldCompress(req)) {
            compress(req, res, buffer);
        } else {
            // Send the original image directly without bypassing
            res.setHeader('content-type', req.params.originType);
            res.setHeader('content-length', buffer.length);
            res.status(200).send(buffer);
        }
    });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

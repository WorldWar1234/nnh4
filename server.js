#!/usr/bin/env node
'use strict';
const express = require('express');
const request = require('request');
const authenticate = require('./src/authenticate');
const params = require('./src/params');
const compress = require('./src/compress');
const shouldCompress = require('./src/shouldCompress');
const bypass = require('./src/bypass');
const redirect = require('./src/redirect');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', authenticate, params, (req, res) => {
    const url = req.params.url;

    // Fetch the image from the URL
    request.get({ url, encoding: null }, (err, origin, buffer) => {
        if (err || origin.statusCode >= 400) {
            // Use the redirect function if there is an error
            return redirect(req, res);
        }

        req.params.originType = origin.headers['content-type'] || '';
        req.params.originSize = buffer.length;

        if (shouldCompress(req)) {
            compress(req, res, buffer);
        } else {
            // Bypass compression and directly send the original image
            bypass(req, res, buffer);
        }
    });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

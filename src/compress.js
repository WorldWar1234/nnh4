const sharp = require('sharp');
const redirect = require('./redirect');

function compress(req, reply, input) {
    const format = req.params.webp ? 'webp' : 'jpeg';

    sharp(input)
        .grayscale(req.params.grayscale)
        .toFormat(format, {
            quality: req.params.quality,
            progressive: true,
            optimizeScans: true
        })
        .toBuffer((err, output, info) => {
            if (err || !info || reply.headersSent) {
                return redirect(req, reply);
            }

            reply.header('content-type', `image/${format}`);
            reply.header('content-length', info.size);
            reply.header('x-original-size', req.params.originSize);
            reply.header('x-bytes-saved', req.params.originSize - info.size);
            reply.header('content-encoding', 'identity');
            reply.header('Access-Control-Allow-Origin', '*');
            reply.header('Cross-Origin-Resource-Policy', 'cross-origin');
            reply.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
            reply.status(200).send(output);
        });
}

module.exports = compress;

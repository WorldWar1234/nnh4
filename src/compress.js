const sharp = require('sharp');
const redirect = require('./redirect');

function compress(request, reply, input) {
    const format = request.query.webp ? 'webp' : 'jpeg';

    sharp(input)
        .grayscale(request.query.bw !== '0')
        .toFormat(format, {
            quality: parseInt(request.query.l, 10) || 40,
            progressive: true,
            optimizeScans: true
        })
        .toBuffer((err, output, info) => {
            if (err || !info || reply.headersSent) {
                return redirect(request, reply);
            }

            reply.header('content-type', `image/${format}`);
            reply.header('content-length', info.size);
            reply.header('x-original-size', request.query.originSize);
            reply.header('x-bytes-saved', request.query.originSize - info.size);
            reply.header('content-encoding', 'identity');
            reply.header('Access-Control-Allow-Origin', '*');
            reply.header('Cross-Origin-Resource-Policy', 'cross-origin');
            reply.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
            reply.status(200).send(output);
        });
}

module.exports = compress;

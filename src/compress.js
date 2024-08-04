const sharp = require('sharp');
const redirect = require('./redirect');

function compress(req, res, input) {
    const format = req.params.webp ? 'webp' : 'jpeg';

    sharp(input)
        .grayscale(req.params.grayscale)
        .toFormat(format, {
            quality: req.params.quality,
            progressive: true,
            optimizeScans: true
        })
        .toBuffer((err, output, info) => {
            if (err || !info || res.headersSent) {
                return redirect(req, res);
            }

            res
                .header('content-type', `image/${format}`)
                .header('content-length', info.size)
                .header('x-original-size', req.params.originSize)
                .header('x-bytes-saved', req.params.originSize - info.size)
                .header('content-encoding', 'identity')
                .status(200)
                .send(output);
        });
}

module.exports = compress;

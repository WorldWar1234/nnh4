const sharp = require('sharp');
const redirect = require('./redirect');

function compress(request, reply, input) {
  const format = request.params.webp ? 'webp' : 'jpeg';

  sharp(input)
    .grayscale(request.params.grayscale)
    .toFormat(format, {
      quality: request.params.quality,
      progressive: true,
      optimizeScans: true,
    })
    .toBuffer((err, output, info) => {
      if (err || !info || reply.sent) {
        return redirect(request, reply);
      }

      reply
        .header('content-type', `image/${format}`)
        .header('content-length', info.size)
        .header('x-original-size', request.params.originSize)
        .header('x-bytes-saved', request.params.originSize - info.size)
        .header('content-encoding', 'identity')
        .status(200)
        .send(output);
    });
}

module.exports = compress;

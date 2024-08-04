const DEFAULT_QUALITY = 40;

function params(request, reply, done) {
  let url = request.query.url;
  if (!url) return reply.send('bandwidth-hero-proxy');

  request.params.url = decodeURIComponent(url);
  request.params.webp = !request.query.jpeg
  request.params.grayscale = request.query.bw != 0
  request.params.quality = parseInt(request.query.l, 10) || DEFAULT_QUALITY

  done();
}

module.exports = params;

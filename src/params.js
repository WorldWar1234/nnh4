const DEFAULT_QUALITY = 40;

function params(request, reply, next) {
    const url = request.query.url;
    if (!url) return reply.send('bandwidth-hero-proxy');

    request.query.url = decodeURIComponent(url);
    request.query.webp = !request.query.jpeg;
    request.query.bw = request.query.bw || '0';
    request.query.quality = parseInt(request.query.l, 10) || DEFAULT_QUALITY;

    next();
}

module.exports = params;

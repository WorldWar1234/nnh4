const DEFAULT_QUALITY = 40;

function params(req, reply, done) {
    let url = req.query.url;
    if (!url) {
        reply.send('bandwidth-hero-proxy');
        return;
    }

    req.params.url = decodeURIComponent(url);
    req.params.webp = !req.query.jpeg;
    req.params.grayscale = req.query.bw != 0;
    req.params.quality = parseInt(req.query.l, 10) || DEFAULT_QUALITY;

    done();
}

module.exports = params;

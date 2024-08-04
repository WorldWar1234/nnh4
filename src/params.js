const DEFAULT_QUALITY = 40;

function params(req, reply, next) {
    const { url, jpeg, bw, l } = req.query;

    // Check if URL parameter is missing
    if (!url) {
        return reply.end('bandwidth-hero-proxy');
    }

    // Process parameters if URL is present
    req.params.url = decodeURIComponent(url);
    req.params.webp = !jpeg;
    req.params.grayscale = bw !== '0';
    req.params.quality = parseInt(l, 10) || DEFAULT_QUALITY;

    next();
}

module.exports = params;

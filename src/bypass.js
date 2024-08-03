function bypass(req, res, buffer) {
    res.setHeader('content-encoding', 'identity');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    res.setHeader('content-length', buffer.length);
    res.status(200).send(buffer);
}

module.exports = bypass;

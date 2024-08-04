function bypass(request, reply, buffer) {
    reply
        .header('content-encoding', 'identity')
        .header('Access-Control-Allow-Origin', '*')
        .header('Cross-Origin-Resource-Policy', 'cross-origin')
        .header('Cross-Origin-Embedder-Policy', 'unsafe-none')
        .header('content-length', buffer.length)
        .status(200)
        .send(buffer);
}

module.exports = bypass;

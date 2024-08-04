function bypass(request, reply, buffer) {
    reply.header('content-encoding', 'identity');
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Cross-Origin-Resource-Policy', 'cross-origin');
    reply.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
    reply.header('content-length', buffer.length);
    reply.status(200).send(buffer);
}

module.exports = bypass;

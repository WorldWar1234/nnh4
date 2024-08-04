function redirect(request, reply) {
    if (reply.headersSent) {
        return;
    }

    reply.header('content-length', 0);
    reply.header('location', encodeURI(request.query.url));
    reply.header('content-encoding', 'identity');
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Cross-Origin-Resource-Policy', 'cross-origin');
    reply.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
    reply.status(302).send();
}

module.exports = redirect;

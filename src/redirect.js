function redirect(req, reply) {
  if (reply.headersSent) {
    return;
  }

  reply.header('content-length', 0);
  reply.removeHeader('cache-control');
  reply.removeHeader('expires');
  reply.removeHeader('date');
  reply.removeHeader('etag');
  reply.header('location', encodeURI(req.params.url));
  reply.header('content-encoding', 'identity');
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Cross-Origin-Resource-Policy', 'cross-origin');
  reply.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  reply.status(302).end();
}

module.exports = redirect;

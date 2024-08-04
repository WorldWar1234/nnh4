function redirect(req, res) {
    if (res.headersSent) {
        return;
    }

    res
        .header('content-length', 0)
        .removeHeader('cache-control')
        .removeHeader('expires')
        .removeHeader('date')
        .removeHeader('etag')
        .header('location', encodeURI(req.params.url))
        .header('content-encoding', 'identity')
        .status(302)
        .send();
}

module.exports = redirect;

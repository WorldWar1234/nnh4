function bypass(req, res, buffer) {
    res
        .header('content-encoding', 'identity')
        .header('content-length', buffer.length)
        .status(200)
        .send(buffer);
}

module.exports = bypass;

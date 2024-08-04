function bypass(req, reply, buffer) {
  reply
    .header('content-encoding', 'identity')
    .header('content-length', buffer.length)
    .status(200)
    .send(buffer);
}

module.exports = bypass;

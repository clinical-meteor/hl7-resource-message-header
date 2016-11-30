describe('clinical:hl7-resources-message-headers', function () {
  var server = meteor();
  var client = browser(server);

  it('MessageHeaders should exist on the client', function () {
    return client.execute(function () {
      expect(MessageHeaders).to.exist;
    });
  });

  it('MessageHeaders should exist on the server', function () {
    return server.execute(function () {
      expect(MessageHeaders).to.exist;
    });
  });

});

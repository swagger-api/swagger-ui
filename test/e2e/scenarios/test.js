describe('Google demo test for Mocha', function () {
  describe('with Nightwatch', function () {
    before(function (client, done) {
      done()
    })

    after(function (client, done) {
      client.end(function () {
        done()
      })
    })

    afterEach(function (client, done) {
      done()
    })

    beforeEach(function (client, done) {
      done()
    })

    it('uses TDD to run the Google simple test', function (client) {
      client
        .url('http://google.com')
        .expect.element('body').to.be.present.before(1000)

      client.setValue('input[type=text]', ['nightwatch', client.Keys.ENTER])
        .pause(1000)
        .assert.containsText('#main', 'Night Watch')
    })
  })
})

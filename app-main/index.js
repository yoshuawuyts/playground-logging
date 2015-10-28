const httpNdjson = require('http-ndjson')
const boleStream = require('bole-stream')
const sizeStream = require('size-stream')
const summary = require('server-summary')
const stdout = require('stdout-stream')
const pumpify = require('pumpify')
const bole = require('bole')
const http = require('http')

const port = 1337

// set bole output level
bole.output({ level: 'info', stream: stdout })

// create reusable log stream for ndjson
const logStream = boleStream({ level: 'debug' })

const server = http.createServer(function (req, res) {
  // create logger
  const httpLogger = httpNdjson(req, res)
  httpLogger.pipe(logStream, { end: false })

  // log response size
  const size = sizeStream()
  size.once('size', size => httpLogger.setContentLength(size))
  const sink = pumpify(size, res)

  // start logic
  sink.end('hello')
})

// start listening
server.listen(port, summary(server, logStream))

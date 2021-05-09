var http = require('http')

var options = {
  host: 'localhost:3000',
  path: '/',
}

http
  .request(options, (response) => {
    if (response.statusCode !== 200) process.exit(20)
    process.exit(0)
  })
  .end()

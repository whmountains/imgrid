var connect = require('connect')
var serveStatic  = require('serve-static')

var app = connect()

app.use(serveStatic(__dirname))

var port = 3000
app.listen(port)
console.log(`listening on *:3000`)

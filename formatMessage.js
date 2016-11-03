module.exports = formatMessage

var ColorHash = require('color-hash')
var colorHash = new ColorHash()
var moment = require('moment')

function formatMessage (msgObj) {
  var time = moment(msgObj.timestamp, 'x').format('h:mma')
  var color = colorHash.hex(msgObj.username)
  return `${time}{${color}-fg} ${msgObj.username}{/${color}-fg} ${msgObj.text}`
}

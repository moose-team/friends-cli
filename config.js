var applicationConfigPath = require('application-config-path')
var mkdirp = require('mkdirp')
var path = require('path')

var CONFIG_PATH = applicationConfigPath('Friends')
mkdirp.sync(CONFIG_PATH)

module.exports = {
  APP_NAME: 'Friends',

  CONFIG_PATH: CONFIG_PATH,
  DB_PATH: path.join(CONFIG_PATH, 'friendsdb'),
  KEYS_PATH: path.join(CONFIG_PATH, 'public-keys')
}

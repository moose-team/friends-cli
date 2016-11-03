module.exports = friends

var catNames = require('cat-names')
var config = require('./config')
var eos = require('end-of-stream')
var githubCurrentUser = require('github-current-user')
var levelup = require('levelup')
var screen = require('./screen')
var Signature = require('./signature')
var subleveldown = require('subleveldown')
var Swarm = require('friends-swarm')
var wrtc = require('wrtc')

function friends (_opts) {
  var opts = Object.assign({
    hubs: 'https://signalhub.mafintosh.com',
    mem: false
  }, _opts)

  var db
  if (opts.mem) {
    db = levelup(config.DB_PATH, {db: require('memdown')})
  } else {
    db = levelup(config.DB_PATH, {db: require('leveldown')})
  }

  db.channels = subleveldown(db, 'channels', {valueEncoding: 'json'})
  db.aliases = subleveldown(db, 'aliases', {valueEncoding: 'json'})

  var data = {
    peers: 0,
    username: 'Anonymous (' + catNames.random() + ')',
    channels: [],
    messages: [],
    users: [],
    activeChannel: null
  }

  var swarm = Swarm(subleveldown(db, 'swarm'), {maxPeers: 20, wrtc: wrtc, hubs: opts.hubs})
  var channelsFound = {}
  var usersFound = {}
  var changesOffsets = {}

  // join default channel
  swarm.addChannel('friends')

  if (githubCurrentUser.verify) githubCurrentUser.verify(onCurrentUser)
  else onCurrentUser(null, false)

  function onCurrentUser (err, verified, username) {
    // if (err || !verified) self.emit('showGitHelp')
    if (err) return console.error(err.message || err)
    if (verified) {
      data.username = username
      swarm.sign(Signature.signer(username))
      screen.redraw(data)
    }
  }

  swarm.verify(Signature.verify)
  swarm.process(processSwarm)

  function processSwarm (basicMessage, cb) {
    var message = basicMessage
    var channelName = message.channel || 'friends'
    var channel = channelsFound[channelName]

    if (!channel) {
      channel = channelsFound[channelName] = {
        id: data.channels.length,
        name: channelName,
        active: false,
        peers: 0,
        messages: []
      }
      data.channels.push(channel)
      data.activeChannel = channel
    }

    if (!changesOffsets[channel.name]) changesOffsets[channel.name] = swarm.changes(channel.name)

    channel.messages.push(message)

    if (!message.anon && message.valid) {
      if (!usersFound[message.username]) {
        usersFound[message.username] = true
        data.users[message.username] = {
          avatar: message.avatar,
          blocked: false
        }
      }

      // update last active time for user
      data.users[message.username].lastActive = message.timestamp
    }
    if (!message.anon && !message.valid) {
      message.username = 'Allegedly ' + message.username
    }

    screen.redraw(data)

    cb()
  }

  swarm.on('peer', function (p, channel) {
    var ch = channelsFound[channel]
    if (ch) ch.peers++
    data.peers++
    eos(p, function () {
      if (ch) ch.peers--
      data.peers--
    })
    screen.redraw(data)
  })

  channelsFound.friends = {
    id: 0,
    name: 'friends',
    active: true,
    peers: 0,
    messages: []
  }

  data.channels.push(channelsFound.friends)
  data.messages = channelsFound.friends.messages
  data.activeChannel = channelsFound.friends

  screen.redraw(data)

  screen.on('message', (message) => {
    swarm.send({
      username: data.username,
      channel: data.activeChannel && data.activeChannel.name,
      text: message,
      timestamp: Date.now()
    })
  })
}

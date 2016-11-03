var blessed = require('blessed')
var formatMessage = require('./formatMessage')

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true,
  fullUnicode: true
})

screen.title = 'Friends (press escape to quit)'

// Quit on Escape or Control-C.
screen.key(['escape', 'C-c'], () => process.exit(0))

// Creating a textarea on the bottom of the screen.
var input = blessed.textarea({
  left: '25%',
  bottom: 0,
  height: 3,
  inputOnFocus: true,
  mouse: true,
  border: 'line',

  style: {
    border: {
      fg: 'grey',
      bg: 'white'
    },
    fg: 'black',
    bg: 'white'
  }
})

input.key(['escape'], () => process.exit(0))
input.key(['enter'], () => {
  var value = input.getValue().slice(0, -1)
  input.clearValue()
  if (value.length < 1) return

  screen.emit('message', value)
})

var activeChannel = blessed.box({
  content: '',
  left: '25%',
  width: '50%',
  height: 1,
  padding: {
    left: 1
  },
  style: {
    fg: 'black',
    bg: 'white',
    bold: true
  }
})

var activeChannelPeers = blessed.box({
  content: '4 peers',
  left: '75%',
  align: 'right',
  height: 1,
  padding: {
    right: 1
  },
  style: {
    fg: 'grey',
    bg: 'white'
  }
})
var leftpane = blessed.layout({
  width: '25%',
  height: '100%',
  style: {
    fg: 'white',
    bg: '#114a56',
    bold: false
  }
})

blessed.box({
  parent: leftpane,
  content: 'FRIENDS',
  align: 'center',
  width: '100%',
  height: 1,
  style: {
    fg: 'white',
    bg: 'black',
    bold: false
  }
})

blessed.box({
  parent: leftpane,
  content: 'CHANNELS',
  width: '100%',
  padding: {
    top: 1
  },
  height: 2,
  style: {
    fg: 'white',
    bg: '#114a56',
    bold: true
  }
})

var channelsList = blessed.list({
  parent: leftpane,
  items: [],
  width: '100%',

  height: '50%-3',
  mouse: true,
  style: {
    selected: {
      bg: '#e84a3e'
    },
    fg: 'white',
    bg: '#114a56'
  }
})

blessed.box({
  parent: leftpane,
  content: 'ACTIVE USERS',
  width: '100%',
  padding: {
    top: 1
  },
  height: 2,
  style: {
    fg: 'white',
    bg: '#114a56',
    bold: true
  }
})

var activeUserList = blessed.list({
  parent: leftpane,
  alwaysScroll: true,
  scrollbar: {
    inverse: true
  },
  width: '100%',

  height: '50%-5',
  mouse: true,
  style: {
    item: {
      padding: {
        left: 2
      }
    },
    selected: {
      bg: '#e84a3e'
    },
    fg: 'white',
    bg: '#114a56'
  }
})

var currentUser = blessed.box({
  left: 0,
  top: '100%-2',
  width: '25%',
  align: 'center',
  height: 1,
  style: {
    fg: 'white',
    bg: '#114a56',
    bold: true
  }
})

var totalPeers = blessed.box({
  left: 0,
  top: '100%-1',
  width: '25%',
  align: 'center',
  height: 1,
  style: {
    fg: 'white',
    bg: '#114a56',
    bold: true
  }
})

var messages = blessed.box({
  padding: {
    left: 1
  },
  tags: true,
  top: 1,
  width: '76%',
  height: '100%-4',
  left: '25%',
  scrollable: true,
  alwaysScroll: true,
  scrollOnInput: true,
  style: {
    bg: 'white',
    fg: 'black',
    scrollbar: {
      bg: 'grey'
    }
  },
  scrollbar: {
    inverse: true
  },
  mouse: true
})

// Append the widget to the screen.
screen.append(leftpane)
screen.append(input)
screen.append(messages)
screen.append(activeChannel)
screen.append(activeChannelPeers)
screen.append(currentUser)
screen.append(totalPeers)

input.focus()

screen.redraw = function redraw (state) {
  currentUser.setText(`${state.username}`)
  activeChannel.setContent(`#${state.activeChannel.name}`)

  var now = new Date().getTime()
  var activeUsers = []
  var sortedUsers = Object.keys(state.users).sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase())
  })

  sortedUsers.forEach(function (username) {
    var user = state.users[username]
    // User is "active" if they sent a message in the last 60 mins (3600000ms)
    if (now - user.lastActive < 3600000) {
      activeUsers.push(username)
    }
  })

  activeUserList.setItems(activeUsers)

  var channelPeers = state.activeChannel.peers
  activeChannelPeers.setContent(`${channelPeers} peer${channelPeers !== 1 ? 's' : ''}`)

  var peers = state.peers
  totalPeers.setContent(`${peers} peer${peers !== 1 ? 's' : ''}`)

  channelsList.setItems(state.channels.map(c => `#${c.name}`))

  var messageContent = state.activeChannel.messages
    .sort((a, b) => a.timestamp > b.timestamp)
    .map(formatMessage)
    .join('\n')

  messages.setContent(messageContent)
  messages.scrollTo(999)
  screen.render()
}

module.exports = screen

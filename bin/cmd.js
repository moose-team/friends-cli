#!/usr/bin/env node

var friends = require('..')
var minimist = require('minimist')
var pkg = require('../package.json')

var argv = minimist(process.argv.slice(2), {
  alias: {
    signalhub: 's',
    help: 'h',
    version: 'v'
  },
  boolean: [
    'help',
    'version'
  ],
  string: [
    'signalhub',
    'db'
  ]
})

if (argv.help) {
  console.log(`
Friends - ${pkg.description}
Usage:
  friends <flags>
Flags:
  -v  --version   Show current version
  -h, --help      Show usage information

  Flags (advanced):
        --hub     Use an alternate signalhub server
        --mem     Use in-memory database (no messages saved to disk)
`)
  process.exit(0)
}

if (argv.version) {
  console.log(pkg.version)
  process.exit(0)
}

friends({mem: argv.mem, hubs: argv.signalhub})

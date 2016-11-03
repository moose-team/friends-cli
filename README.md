# friends-cli

> P2P chat powered by webrtc in a terminal

[![travis][travis-image]][travis-url]
[![david][david-image]][david-url]

[travis-image]: https://img.shields.io/travis/moose-team/friends-cli.svg?style=flat-square
[travis-url]: https://travis-ci.org/moose-team/friends-cli
[david-image]: https://img.shields.io/david/moose-team/friends-cli.svg?style=flat-square
[david-url]: https://david-dm.org/moose-team/friends-cli

**This project is alpha quality.** You probably only want to use this if you like to send pull requests fixing things :)

## How it works

See [our site](http://moose-team.github.io/friends/).

## Install

```bash
npm install --global friends
```

## Run
```bash
friends
```

### Options
```bash
friends --help

Friends - P2P chat powered by webrtc in a terminal
Usage:
  friends <flags>
Flags:
  -v  --version   Show current version
  -h, --help      Show usage information

  Flags (advanced):
      --hub     Use an alternate signalhub server
      --mem     Use in-memory database (no messages saved to disk)
```

## Usage

### GitHub Login

Friends currently uses your git and github configuration for authentication.

If you don't already have a public key on GitHub and corresponding private key on your machine, you'll need to [set that up first](https://help.github.com/articles/generating-ssh-keys/). Make sure your github username is also set, using `git config --global github.user yourusername`.

If you're having trouble getting this part to work, do this to get debug information:

```
$ npm i github-current-user -g
$ DEBUG=* github-current-user
```

and then report an [issue](https://github.com/moose-team/friends-cli/issues).

**Note**: DSA keys are not supported. You should switch to RSA anyway for security reasons.

If it can't verify you, try doing `ssh-add ~/.ssh/id_rsa`. Your key should show up when you run `ssh-add -l`.

## Contributing

Contributions welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before getting started.

## License

[MIT](LICENSE.md)

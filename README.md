# airplay-mdns-server

An AirPlay mDNS broadcast server.

This module is not an AirPlay server in it self, but mearly broadcasting
its address (the mac/ip of the machine running this Node module) using
multicast DNS.

[![Build status](https://travis-ci.org/watson/airplay-mdns-server.svg?branch=master)](https://travis-ci.org/watson/airplay-mdns-server)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install airplay-mdns-server
```

## Usage

```js
var mdns = require('airplay-mdns-server')

var opts = {
  name: 'My AirPlay Server',
  version: '1.0.0',
  port: 5000
}

mdns(opts, function (err) {
  if (err) throw err
  console.log('AirPlay server is being advertised')
})
```

## License

MIT

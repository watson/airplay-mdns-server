'use strict'

var mdns = require('mdns')
var getmac = require('getmac')
var pkg = require('./package')
var debug = require('debug')(pkg.name)

// required options:
// - name
// - port
//
// optional options:
// - txt
// - mac
module.exports = function (opts, cb) {
  if (opts.mac) {
    broadcast(opts.mac)
  } else {
    getMac(function (err, mac) {
      if (err) return cb(err)
      broadcast(mac)
    })
  }

  function broadcast (mac) {
    var txt = opts.txt || generateTxt(mac)
    debug('Advertising AirPlay server on port %d', opts.port, opts.name, txt)

    mdns
      .createAdvertisement(mdns.tcp('airplay'), opts.port, { name: opts.name, txtRecord: txt })
      .start()

    process.nextTick(function () {
      cb(null, txt)
    })
  }

  function generateTxt (mac) {
    var features = opts.features || module.exports.normalFeatures
    var featureMask = generateFeatureMask(features)

    return {
      deviceid: mac.toUpperCase(), // MAC address
      features: featureMask,       // supported features
      model: 'AppleTV2,1',         // device model
      srcvers: '130.14'            // server version
    }
  }
}

function getMac (cb) {
  // TODO: This doesn't necessarily find the MAC address associated with the
  // interface that the server is broadcasting on
  debug('Getting server MAC address')
  getmac.getMac(function (err, mac) {
    if (err) return cb(err)
    debug('Found MAC address', mac)
    cb(null, mac)
  })
}

function generateFeatureMask (base10) {
  var hex = base10.toString(16).toUpperCase()
  var rest = hex.length % 8
  var groups = hex.slice(rest).match(/.{8}/g) || []
  if (rest) groups.unshift(hex.slice(0, rest))
  return '0x' + groups.reverse().join(',0x')
}

module.exports.features = {
  VIDEO: 1,                    // video support
  PHOTO: 2,                    // photo support
  VIDEO_FAIR_PLAY: 4,          // video protected with FairPlay DRM
  // VIDEO_VOLUME_CONTROL: 8,     // volume control supported for videos
  VIDEO_HTTP_LIVE_STREAMS: 16, // http live streaming supported
  SLIDESHOW: 32,               // slideshow supported
  // ??: 64                       // Unknown
  SCREEN: 128,                 // mirroring supported
  SCREEN_ROTATE: 256,          // screen rotation supported
  AUDIO: 512,                  // audio supported
  AUDIO_REDUNDANT: 1024,       // audio packet redundancy supported
  FPSAP_V2_AES_GCM: 2048,      // FairPlay secure auth supported
  PHOTO_CACHING: 4096          // photo preloading supported
}

module.exports.allFeatures = Object.keys(module.exports.features)
  .reduce(function (a, b) {
    return module.exports.features[a] | module.exports.features[b]
  })

module.exports.normalFeatures = parseInt('11100111110111', 2) // 14839 / 0x39f7

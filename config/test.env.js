var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  SITE_NAME: '"asdf.land"',
  BASE_URL: '"localhost:8080"'
})

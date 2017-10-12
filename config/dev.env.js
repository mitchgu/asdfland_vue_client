var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SITE_NAME: '"asdf.land"',
  BASE_URL: '"localhost:8080"',
  BACKEND_URL: '"localhost:9090"',
})

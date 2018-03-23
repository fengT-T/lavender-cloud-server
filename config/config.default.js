const path = require('path')

module.exports = appInfo => {
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1519802502681_5037'

  // add your config here
  config.middleware = []

  // config mongoose
  config.mongoose = {
    url: 'mongodb://127.0.0.1/lavender'
  }

  config.multipart = {
    whitelist: (filename) => true,
    fileSize: '1gb'
  }
  // file store dir
  config.fileDir = path.join(appInfo.root, 'cloud')

  return config
}

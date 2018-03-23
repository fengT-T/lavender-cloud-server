const path = require('path')
const fs = require('fs')
const mime = require('mime-types')

module.exports = {
  getFilePath () {
    // 强行规定 路径 都放到 path 里面
    const userDir = this.app.config.fileDir
    const id = this.ctx.params.id
    const requirePath = this.ctx.params.filePath || ''
    return {
      filePath: path.join(userDir, id, requirePath),
      requirePath,
      isShare: /^share\/|^share$/.test(requirePath)
    }
  },
  getFileStatus (filePath) {
    const {base, ext} = path.parse(filePath)
    const mineType = ext ? mime.lookup(ext) : 'unknown'
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (error, stat) => {
        error ? reject(error)
          : resolve({...stat,
            fileName: base,
            isDirectory: stat.isDirectory(),
            mime: stat.isDirectory() ? 'directory' : mineType,
            isFile: stat.isFile()
          })
      })
    })
  }
}

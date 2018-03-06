const path = require('path')
const fs = require('fs')

module.exports = {
  getFilePath () {
    // 强行规定 路径 都放到 path 里面
    const {id = '', groupId = ''} = this.ctx.session
    const userDir = path.join(this.app.config.fileDir, groupId, id)
    const requirePath = this.ctx.params.filePath || ''
    return {
      filePath: path.join(userDir, requirePath),
      requirePath,
      isShare: /^\w+\/\w+\/share/.test(requirePath)
    }
  },
  getFileStatus (filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (error, stat) => {
        error ? reject(error)
          : resolve({...stat,
            fileName: path.parse(filePath).base,
            isDirectory: stat.isDirectory(),
            isFile: stat.isFile()
          })
      })
    })
  }
}

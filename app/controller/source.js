const Controller = require('egg').Controller
var crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
const mime = require('mime-types')

class SourceController extends Controller {
  async getFileList () {
    const {filePath} = this.ctx.helper.getFilePath()
    const {getFileStatus} = this.ctx.helper

    try {
      const fileList = await new Promise((resolve, reject) => {
        fs.readdir(filePath, (error, result) => {
          error ? reject(error) : resolve(result)
        })
      })
      let promiseList = []
      fileList.forEach(file => {
        promiseList.push(getFileStatus(path.join(filePath, file)))
      })
      this.ctx.body = await Promise.all(promiseList)
    } catch (e) {
      this.ctx.status = 400
    }
  }

  async download () {
    const {filePath} = this.ctx.helper.getFilePath()
    const {getFileStatus} = this.ctx.helper

    try {
      this.ctx.type = mime.lookup(filePath)
      const mtime = (await getFileStatus(filePath)).mtime

      if (mtime.getTime() - Date.parse(this.ctx.header['if-modified-since']) < 1000) {
        this.ctx.status = 304
      } else {
        this.ctx.body = fs.createReadStream(filePath)
      }
      this.ctx.set('Cache-Control', 'no-cache')
      this.ctx.lastModified = mtime
    } catch (e) {
      this.ctx.status = 400
    }
  }

  async upload () {
    const {filePath} = this.ctx.helper.getFilePath()
    const stream = await this.ctx.getFileStream()
    try {
      await awaitWriteStream(stream.pipe(
        fs.createWriteStream(path.join(filePath, stream.filename))
      ))
    } catch (e) {
      await sendToWormhole(stream)
      this.ctx.status = 400
    }
    this.ctx.status = 200
  }

  async rename () {
    const {filePath} = this.ctx.helper.getFilePath()
    const {newName} = this.ctx.request.body
    const newPath = path.join(path.dirname(filePath), newName)
    try {
      await new Promise((resolve, reject) => {
        fs.rename(filePath, newPath, (error) => {
          error ? reject(error) : resolve()
        })
      })
    } catch (e) {
      this.ctx.status = 400
    }
    this.ctx.status = 200
  }

  async deleteFile () {
    const {filePath} = this.ctx.helper.getFilePath()
    try {
      await new Promise((resolve, reject) => {
        fs.unlink(filePath, (error) => {
          error ? reject(error) : resolve()
        })
      })
    } catch (e) {
      this.ctx.status = 400
    }
    this.ctx.status = 200
  }

  async deleteDir () {
    const {filePath} = this.ctx.helper.getFilePath()
    try {
      await new Promise((resolve, reject) => {
        fs.rmdir(filePath, (error) => {
          error ? reject(error) : resolve()
        })
      })
    } catch (e) {
      this.ctx.status = 400
    }
    this.ctx.status = 200
  }
}
module.exports = SourceController

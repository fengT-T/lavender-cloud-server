const crypto = require('crypto')

module.exports = app => {
  function passwordCrypto (str) {
    return crypto.createHmac('sha1', app.config.keys).update(str).digest('hex')
  }

  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema({
    name: {
      type: String,
      minlength: 3,
      maxlength: 20,
      required: true,
      trim: true,
      index: true,
      unique: true
    },
    password: {
      // 密码使用hash摘要
      type: String,
      set: str => passwordCrypto(str),
      required: true
    },
    headImgUrl: {
      type: String,
      default: 'http://orblzfbb0.bkt.clouddn.com/FgbB5y75eewjtvKRZxQktFRAWiz6',
      required: true
    },
    permissions: {
      read: {
        type: Boolean,
        default: true
      },
      update: {
        type: Boolean,
        default: false
      },
      upload: {
        type: Boolean,
        default: false
      },
      delete: {
        type: Boolean,
        default: false
      },
      admin: {
        type: Boolean,
        default: false
      }
    },
    group: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
    }
  })

  UserSchema.methods.checkPassword = function (passwordString) {
    return this.password === passwordCrypto(passwordString)
  }

  UserSchema.statics.getUserByName = async function (name) {
    let result = await this.findOne({name}).exec()
    return result
  }

  return mongoose.model('users', UserSchema)
}

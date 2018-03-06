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
      index: true
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
      index: true,
      ref: 'groups'
    }
  })

  UserSchema.methods.checkPassword = function (passwordString) {
    return this.password === passwordCrypto(passwordString)
  }

  UserSchema.statics.getUserByName = async function (name) {
    let result = await this.findOne({name}).populate('group').exec()
    return result
  }

  UserSchema.statics.getUserById = async function (id) {
    const user = await this.findById(id).populate('group').exec()
    return user
  }

  UserSchema.methods.getUserPermissions = function () {
    const userPermssions = this.toObject().permissions
    const groupPermissions = this.toObject().group.permissions
    const userPermssionsArray = Object.keys(userPermssions).filter(e => userPermssions[e])
    const groupPermissionssArray = Object.keys(groupPermissions).filter(e => groupPermissions[e])
    return new Set([...userPermssionsArray, ...groupPermissionssArray])
  }

  return mongoose.model('users', UserSchema)
}

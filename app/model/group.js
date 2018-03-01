module.exports = app => {
  const mongoose = app.mongoose

  let groupSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
      index: true
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
    }
  })

  return mongoose.model('groups', groupSchema)
}

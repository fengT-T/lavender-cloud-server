const Controller = require('egg').Controller

class UserController extends Controller {
  async login () {
    const {User} = this.ctx.model
    const {name, password} = this.ctx.request.body

    const _user = await User.getUserByName(name)

    if (!_user) {
      this.ctx.body = {error: 401, msg: '用户不存在'}
      this.ctx.status = 401
      return
    }

    if (_user.checkPassword(password)) {
      const {_id, group, headImgUrl} = _user
      this.ctx.session = {id: _user._id}
      this.ctx.body = {id: _id, name, group, headImgUrl}
    } else {
      this.ctx.body = {error: 401, msg: '密码错误'}
      this.ctx.status = 401
    }
  }

  async register () {
    const {User} = this.ctx.model
    const {name, password, group} = this.ctx.request.body

    const _user = await User.getUserByName(name)

    if (_user) {
      this.ctx.body = {error: 403, msg: '用户已存在'}
      this.ctx.status = 403
      return
    }

    await (new User({name, password, group})).save()
    this.ctx.status = 200
  }
}

module.exports = UserController

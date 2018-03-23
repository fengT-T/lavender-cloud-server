const Controller = require('egg').Controller

class UserController extends Controller {
  async login () {
    const {User} = this.ctx.model
    const {name, password} = this.ctx.request.body

    const user = await User.getUserByName(name)

    if (!user) {
      this.ctx.body = {error: 401, msg: '用户不存在', filed: 'name'}
      this.ctx.status = 401
      return
    }

    if (user.checkPassword(password)) {
      const {id, group, headImgUrl, permissions} = user
      this.ctx.session = {id: user.id, groupId: group.id}
      this.ctx.body = {id, name, group, headImgUrl, permissions}
    } else {
      this.ctx.body = {error: 401, msg: '密码错误', filed: 'password'}
      this.ctx.status = 401
    }
  }

  async info () {
    const {User} = this.ctx.model
    const user = await User.getUserById(this.ctx.session.id)
    const {id, name, group, headImgUrl, permissions} = user
    this.ctx.body = {id, name, group, headImgUrl, permissions}
  }

  async register () {
    const {User} = this.ctx.model
    const {name, password, group} = this.ctx.request.body

    await (new User({name, password, group})).save()
    this.ctx.status = 200
  }
}

module.exports = UserController

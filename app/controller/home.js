const Controller = require('egg').Controller

class HomeController extends Controller {
  async index () {
    this.ctx.body = '<img src="/source/5a97e990ba94934776b6a97d/5a9805392f37021fcb653fa1/share/plot.svg" alt="">'
  }
}

module.exports = HomeController

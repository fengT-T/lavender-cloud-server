module.exports = options => {
  return async function isLogin (ctx, next) {
    if (ctx.session.id) {
      await next()
    } else {
      ctx.body = {error: 401, msg: '没有登录'}
      ctx.status = 401
    }
  }
}

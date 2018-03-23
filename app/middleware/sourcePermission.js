module.exports = (options, app) => {
  return async function sourcePermission (ctx, next) {
    const {User} = ctx.model
    const {id} = ctx.session
    const {method} = ctx
    // 任何人对于share的 get 请求放行
    const {isShare} = ctx.helper.getFilePath()
    if (isShare && method === 'GET') {
      await next()
      return
    }
    // 用户登录权限检查
    if (!id) {
      ctx.body = {error: 401, msg: '没有登录'}
      ctx.status = 401
      return
    }
    const permissions = await (await User.getUserById(id))
      .getUserPermissions()
    // admin 放行
    if (permissions.has('admin')) {
      await next()
      return
    }
    // 违规操作他人目录
    if (ctx.params.id !== id) {
      ctx.body = {error: 403, msg: `你没有权限操作${ctx.params.id}的目录`}
      ctx.status = 403
      return
    }
    // 自己目录的权限检查
    const mapping = {
      'GET': {permission: 'read', msg: '读取'},
      'POST': {permission: 'upload', msg: '上传'},
      'PUT': {permission: 'update', msg: '修改'},
      'DELETE': {permission: 'delete', msg: '删除'}
    }

    if (!permissions.has(mapping[method].permission)) {
      ctx.body = {error: 403, msg: `你没有${mapping[method].msg}权限`}
      ctx.status = 403
      return
    }

    await next()
  }
}

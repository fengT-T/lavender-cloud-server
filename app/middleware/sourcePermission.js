module.exports = (options, app) => {
  return async function sourcePermission (ctx, next) {
    const {User} = ctx.model
    const {id} = ctx.session
    const {method} = ctx

    const {isShare} = ctx.helper.getFilePath()
    if (isShare) {
      await next()
      return
    }

    const permissions = await (await User.getUserById(id))
      .getUserPermissions()

    if (!ctx.session.id) {
      ctx.body = {error: 401, msg: '没有登录'}
      ctx.status = 401
      return
    }

    if (permissions.has('admin')) {
      await next()
      return
    }

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

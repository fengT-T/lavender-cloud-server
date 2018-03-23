/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app
  router.get('/', controller.home.index)

  router.post('/user/login', controller.user.login)
  router.get('/user', middleware.isLogin(), controller.user.info)
  router.post('/user/register', controller.user.register)

  router.get('/dir/:id/:filePath*',
    middleware.sourcePermission(), controller.source.getFileList)
  router.delete('/dir/:id/:filePath*',
    middleware.sourcePermission(), controller.source.deleteDir)

  router.get('/source/:id/:filePath*',
    middleware.sourcePermission(), controller.source.download)
  router.post('/source/:id/:filePath*',
    middleware.sourcePermission(), controller.source.upload)
  router.put('/source/:id/:filePath*',
    middleware.sourcePermission(), controller.source.rename)
  router.delete('/source/:id/:filePath*',
    middleware.sourcePermission(), controller.source.deleteFile)
}

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app
  router.get('/', controller.home.index)

  router.post('/user/login', controller.user.login)
  router.post('/user/register', controller.user.register)

  router.get('/dir/:filePath*',
    middleware.sourcePermission(), controller.source.getFileList)
  router.delete('/dir/:filePath*',
    middleware.sourcePermission(), controller.source.deleteDir)

  router.get('/source/:filePath*',
    middleware.sourcePermission(), controller.source.download)
  router.post('/source/:filePath*',
    middleware.sourcePermission(), controller.source.upload)
  router.put('/source/:filePath*',
    middleware.sourcePermission(), controller.source.rename)
  router.delete('/source/:filePath*',
    middleware.sourcePermission(), controller.source.deleteFile)
}

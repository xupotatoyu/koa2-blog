const router = require('koa-router')()
const { login,sign } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/api/user')

router.post('/login',async function (ctx,next) {
  console.log('访问到login',ctx.request.body)
  const { username, password } = ctx.request.body
  const data =await login(username, password) 
  console.log('data',data)   
    if (data.username) {
      // 设置session
      ctx.session.username = data.username
      ctx.session.realname = data.realname

      console.log('req.session is ', ctx.session)
      ctx.body= new SuccessModel({errno:0})
      return //登录成功后返回，不再执行下面的信息
    } else {
      ctx.body= new ErrorModel({errno:1})
    }

})

router.post('/quit',async function (ctx,next) {
  console.log('访问到login',ctx.session) 
    if (ctx.session) {
      // 设置session
      ctx.session.username = ''
      ctx.session.realname = ''
      console.log('req.session is ', ctx.session)
      ctx.body= new SuccessModel({errno:0})
      console.log('退出成功')
      return //登录成功后返回，不再执行下面的信息
    } else {
      ctx.body= new ErrorModel({errno:1})
    }

})

router.post('/sign',async function (ctx,next) {
  console.log('访问到sign',ctx.request.body)
  const { username, password } = ctx.request.body
  const result =await sign(username, password) 
  ctx.body = new SuccessModel(result)
})

module.exports = router
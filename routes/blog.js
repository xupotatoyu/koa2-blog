const router = require('koa-router')()
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel }= require('../model/resModel')
const loginCheck =require('../minddleware/loginCheck')

router.prefix('/api/blog')

//获取博客列表
router.get('/list', async (ctx, next) => {
  let author = ctx.query.author || ''
  const keyword = ctx.query.keyword || ''

  if (ctx.query.isadmin) {
      console.log('is admin')
      // 管理员界面
      if (ctx.session.username == null) {
          console.error('is admin, but no login')
          // 未登录
          ctx.body=new ErrorModel('未登录');
          return
      }
      // 强制查询自己的博客
      author = ctx.session.username
  }
    const listData = await getList(author, keyword);
    ctx.body = new SuccessModel(listData)
});

// 获取博客详情
router.get('/detail',async (ctx,next) =>{
    const data= await getDetail(ctx.query.id)
    ctx.body = new SuccessModel(data)
})

//新建博客数据
router.post('/new', loginCheck,async (ctx, next) =>{
    ctx.request.author = ctx.session.username//加入当前用户的姓名
    const body = ctx.request.body
    body.author = ctx.session.username
    const result = await newBlog(body)
    ctx.body = new SuccessModel(result)
})

//更新博客数据
router.post('/update',loginCheck,async (ctx, next)=>{
  const result =await updateBlog(ctx.query.id,ctx.request.body)
  if (result) {   
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel('更新博客失败')
  }
})

//删除博客数据
router.post('/del', loginCheck,async (ctx, next) => {
  const result = await delBlog(ctx.query.id, ctx.session.username)
  if (result) {   
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel('删除博客失败')
  }
})

module.exports = router
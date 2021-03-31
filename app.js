// 创建服务器
const express = require('express')
const server = express()
server.listen(10086, function () {
    console.log('服务器已启动');

})


// 解决跨域问题
const cors = require('cors')
server.use(cors())

//设置静态资源托管
server.use('/uplpad', express.static('uploads'))

// token 验证
const jwt = require('express-jwt');
// app.use(jwt().unless());
// jwt() 用于解析token，并将 token 中保存的数据 赋值给 req.user
// unless() 约定某个接口不需要身份认证
server.use(jwt({
    secret: 'l-ddui', // 生成token时的 钥匙，必须统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
}).unless({
    path: ['/api/login', '/api/reguser', /^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
}));

// 注册路由
const accountRouter = require('./router/account_router.js')
const userRouter = require('./router/user_router.js')
const articleRouter = require('./router/ariticle_router.js')
server.use('/my/article/', articleRouter)
server.use('/api', accountRouter)
server.use('/my', userRouter)

// 错误中间件处理
server.use((err, req, res, next) => {
    console.log('有错误', err)
    if (err.name === 'UnauthorizedError') {
        // res.status(401).send('invalid token...');
        res.status(401).send({ code: 1, message: '身份认证失败！' });
    }
});
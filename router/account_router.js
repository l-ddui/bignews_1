const express = require('express')
const router = express.Router()
const conn = require('../util/sql')
const jwt = require('jsonwebtoken')


router.use(express.urlencoded())

// 用户注册
router.post('/reguser', (req, res) => {
    // console.log(req.body);
    // 获取参数
    const { username, password } = req.body
    // 判断用户名是否被占用
    const sqlSelect = `select username from users where username="${username}"`
    // console.log(sqlSelect);
    conn.query(sqlSelect, (err, result) => {
        if (err) {
            res.json({ "status": 1, "message": "服务器出错!" })
            return
        }
        if (result.length > 0) {
            res.json({ "status": 1, "message": "用户名被占用!" })
            return
        }
        // 拼接sql语句
        const sqlStr = `insert into users (username,password) values ("${username}","${password}")`
        // 执行sql
        conn.query(sqlStr, (err, result) => {
            // console.log(err);
            console.log(result);
            // 根据不同结果返回不同内容
            if (err) {
                res.json({ "status": 1, "message": "服务器出错!" })
                return
            }
            res.json({ "status": 0, "message": "注册成功！" })
        })
    })
})

// 用户登录
router.post('/login', (req, res) => {
    //获取参数
    const { username, password } = req.body
    // 拼接sql
    const sqlStr = `select username,password from users where username="${username}" and password="${password}"`
    // console.log(sqlStr);
    //执行sql
    conn.query(sqlStr, (err, result) => {
        // 根据不同结果返回不同内容
        if (err) {
            res.json({ "status": 1, "message": "服务出错" })
            return
        }
        if (result.length > 0) {
            // 生成token
            const tokenStr = jwt.sign({ name: username }, 'l-ddui', { expiresIn: 20 })
            const token = 'Bearer  ' + tokenStr
            res.json({ "status": 0, "message": "登录成功！", token })
        } else {
            res.json({ "status": 1, "message": "用户名或密码出错" })
        }
    })
})



// 导出
module.exports = router
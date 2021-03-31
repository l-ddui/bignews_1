const express = require('express')
const router = express.Router()
const conn = require('../util/sql')
// 文件上传
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },    // 保存位置
    filename: function (req, file, cb) {
        // console.log('file', file)
        // const filenameArr = file.originalname.split('.');
        cb(null, file.originalname) //  + "." +filenameArr[filenameArr.length-1]);
    }   // 保存文件名
})

let upload = multer({ storage })


router.use(express.urlencoded())


// 获取用户信息
router.get('/userinfo', (req, res) => {
    // console.log(req.query);
    // 获取用户参数
    const { username } = req.query
    // 拼接sql
    const sqlStr = `select * from users where username="${username}"`
    // console.log(sqlStr);
    // 执行sql
    conn.query(sqlStr, (err, result) => {
        // 根据不同结果返回不同内容
        console.log(err);
        console.log(result);
        if (err) {
            res.json({ "status": 1, "message": "服务器出错！" })
        }
        if (result.length > 0) {
            res.json({ "status": 0, "message": "获取用户基本信息成功！", "data": result[0] })
        } else {
            res.json({ "status": 1, "message": "请求出错" })
        }
    })
})

// 更新用户信息
router.post('/userinfo', (req, res) => {
    // 获取参数
    const { id, nickname, email, userPic } = req.body

    let condition = []
    if (nickname) {
        condition.push(`nickname = "${nickname}"`)
    }
    if (email) {
        condition.push(`email = "${email}"`)
    }
    if (userPic) {
        condition.push(`userPic = "${userPic}"`)
    }
    // console.log(condition);
    let conditionStr = condition.join()
    // console.log(conditionStr);
    const sqlStr = `update users set ${conditionStr} where id=${id}`
    // console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        // console.log(result);
        if (err) {
            res.json('服务器出错!')
            return
        }
        if (result.changedRows != 0) {
            res.json({ "status": 0, "message": "修改用户信息成功！" })
        } else {
            res.json({ "status": 1, "message": "修改用户信息失败！" })

        }

    })
})

// 上传用户头像
router.post('/uploadPic', upload.single('file_data'), (req, res) => {
    // console.log(req.file);
    // console.log(req.body);
    // 上传成功
    if (req.file) {
        res.json({ "status": 0, "message": 'http://127.0.0.1:10086/' + req.file.filename })
    }

})

//重置密码
router.post('/updatepwd', (req, res) => {
    // 获取参数
    const { oldPwd, newPed, id } = req.body
    const sqlStr = `update users set password="${newPed}" where id="${id}" and password="${oldPwd}"`
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        // console.log(result);
        if (err) {
            res.json({ "status": 1, "message": "服务器出错" })
            return
        }
        if (result.changedRows != 0) {
            res.json({ "status": 0, "message": "更新密码成功!" })
        } else {
            res.json({ "status": 1, "message": "原密码错误!" })
        }
    })
})


// 导出
module.exports = router
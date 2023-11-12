const Router=require('express')
const router = new Router()
const userController = require('../controller/user.controller')
const{check} = require('express-validator')
const verification = require('../middlewear/user-verification')



router.post('/signin',userController.SignIn )

router.post('/signup',[
check("mail","Email cannot be empty").notEmpty(),
check("mail","Email cannot be empty").isEmail(),
check("password","Password cannot be empty").notEmpty()
],userController.SignUp )

router.get('/user',verification,userController.GetUser)
router.put('/createtable/:name',userController.createTable)
router.get('/gettable/:name',userController.getTable)
router.post('/shortlink',userController.Shortlink)
router.get('/:shortlink',userController.GoToLink)

module.exports = router
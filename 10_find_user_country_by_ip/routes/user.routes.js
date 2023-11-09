const Router=require('express')
const router = new Router()
const userController = require('../controller/user.controller')
const{check} = require('express-validator')


router.post('/signin',userController.SignIn )
router.post('/signup',[
check("mail","Email cannot be empty").notEmpty(),
check("mail","Email cannot be empty").isEmail(),
check("password","Password cannot be empty").notEmpty()
],userController.SignUp )
router.get('/user',userController.GetUser)
router.get('/country',userController.GetCountry)

module.exports = router
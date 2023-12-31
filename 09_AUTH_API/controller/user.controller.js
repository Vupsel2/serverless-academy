const db=require('../db');
const bcrypt = require('bcrypt');
const{validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');



const GenerateToken=(id,mail)=>{
    
    const payload = {
        id: `${id}`,
        mail: `${mail}` 
    }
    const acsess=jwt.sign(payload,secret, {expiresIn:"60m"})
    const refresh=jwt.sign(payload,secret)
    
    tokens={acsess,refresh}
   
    return tokens
}

class UserController{
    
    async SignUp(req,res){

        try{
            const errors = validationResult(req)
            
            if (!errors.isEmpty()) {
                console.log(errors)
                return res.status(400).json({errors})
                
            }
            const {mail,password} = req.body;
            const candidate= await db.query(`SELECT EXISTS (SELECT 1 FROM users WHERE mail = '${mail}')`) 
            
            if(candidate.rows[0].exists){
                return res.status(502).json({error:"This emeail already registered"});
            }
            const hashpassword = bcrypt.hashSync(password,5) 

            const NewUser= await db.query("INSERT INTO users (mail,password) VALUES ($1,$2) RETURNING *",[mail,hashpassword])
            const token=GenerateToken(NewUser.rows[0].id, NewUser.rows[0].mail)
            console.log(NewUser)
            
            res.status(200).json({id:NewUser.rows[0].id ,AccessToken:token.acsess,RefreshToken:token.refresh});
            
        }catch(e){
            console.log(e);
        }
    }   
    async SignIn(req,res){
 
        const {mail,password} = req.body;
        const candidate= await db.query(`SELECT * FROM users WHERE mail = '${mail}'`)

        if(!candidate.rows[0]){
            return res.status(502).json({error:"Wrong email or password"});
        } 
        const validpassword = bcrypt.compareSync(password, candidate.rows[0].password)
        if(!validpassword){
            return res.status(502).json({error:"Wrong email or password"});

        }
        const token=GenerateToken(candidate.rows[0].id, candidate.rows[0].mail)

        res.status(200).json({AccessToken:token.acsess,RefreshToken:token.refresh});

    }

    async GetUser(req,res){
        try{
            const decoded = req.decoded
            res.status(200).json({id:decoded.id, mail:decoded.mail});

        }catch(e){
            console.log(e);
        }
    }
}
module.exports=new UserController()
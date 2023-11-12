const db=require('../db');
const bcrypt = require('bcrypt');
const{validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const shortid = require('shortid');



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

    async createTable(req,res){
        const allvelues = []
        const types=[]
        const body = req.body
        const table_names=Object.keys(body[0]);
        
        for(let i in body[0]){
            //console.log(i);
            if( i=='id'){types.push("INT PRIMARY KEY")}
            else{
            if (typeof body[0][i]=='string'){
                types.push("VARCHAR(255)")
            }
            else{
                types.push("INT")
            }
            
        }
        }
        const obj=[]
        for (var i=0; i<types.length; i++){
            obj.push(table_names[i]+" "+types[i])
        }

        const name = req.params.name
        try {
        await db.query(`CREATE TABLE ${name} (${obj.join(', ')})`);
        for (var i=0; i<body.length; i++){
            const velues = Object.values(body[i])
            //console.log(velues)
            const values = `(${velues.map(value => typeof value === 'string' ? `'${value}'` : value).join(', ')})`    
            //console.log(velues.join(', '))
            allvelues.push(values)
        }
        //console.log(allvelues.join(', '))
        //console.log(table_names.join(', '))

        await db.query(`INSERT INTO ${name} (${table_names.join(', ')}) VALUES ${allvelues.join(', ')}`)
        res.status(200).json({success: 'Your Json added and saved'});
    } catch(e) {
        console.log(e)
        res.status(502).json({error: 'This name already taken'});
    }
        //console.log(name);

    }
    async getTable(req,res){
        const name = req.params.name
        const table=await db.query(`SELECT * FROM ${name}`);
        res.status(200).json({table:table});
    }
    async Shortlink(req, res){
        const link= req.body.link

        
        const isValidUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(link);
        if (!isValidUrl) {
            return res.status(400).json({ error: 'Invalid URL' });
          }
          try{
        const url = await db.query('SELECT * FROM links WHERE fulllink = $1', [link]);
        if(url.rows.length > 0) {
            //console.log(url.rows);
            res.status(200).json({ shortUrl: "http://localhost:3000/auth/"+url.rows[0].shortlink });
        }
        else{
            const shortLink = shortid.generate();
            await db.query('INSERT INTO links(fulllink, shortlink) VALUES($1, $2)', [link, shortLink]);
            res.status(200).json({ shortUrl: "http://localhost:3000/auth/"+shortLink });
        }
          }
        catch(e){
            console.error(e);
            res.status(500).json({ error: 'Internal Server Error' });
            
          }
    }
    async GoToLink(req, res){
        const shortlink = req.params.shortlink
        
        try {
            
            const url = await db.query('SELECT * FROM links WHERE shortlink = $1', [shortlink]);
            //console.log(url.rows)
            if (url.rows.length > 0) {
                //console.log(url.rows[0].FullLink)
              res.redirect(url.rows[0].fulllink);
            } else {
              res.status(404).json({ error: 'URL not found' });
            }
          } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        };
        
}
    


module.exports=new UserController()
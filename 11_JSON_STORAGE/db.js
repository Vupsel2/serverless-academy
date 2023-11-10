const Pool=require('pg').Pool
const pool=new Pool({

user:'postgres',
password:'eM-2P9bUyemf7**',
host:'db.ypwmggspyizcehhggbqi.supabase.co',
port:5432,
database:'postgres'

});


module.exports=pool;
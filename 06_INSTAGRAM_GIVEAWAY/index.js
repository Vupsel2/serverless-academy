const fs = require('fs');
const readline = require('readline');

console.time("Time consumed");

async function create(){
    let base = new Set();
    const rl = readline.createInterface({
        input: fs.createReadStream("06_INSTAGRAM_GIVEAWAY\\out0.txt"),
      
      });
      
      
      for await (const line of rl) { 
        base.add(line);
      };

    for(let i = 1; i <= 19; i++){
    const unique = new Set()
    
    const rl = readline.createInterface({
        input: fs.createReadStream(`06_INSTAGRAM_GIVEAWAY\\out${i}.txt`),  
    });
    for await (const line of rl) {
        
        if (base.has(line)) {
            unique.add(line)
            
        }

    }
    base=unique;
    }
    // console.log(uniqsize)
    console.log("Number of unique names which exist in all Files: " + base.size)
    // base.clear();
    // base.add(unique.values());
    
    
    
}
async function create_10(){
    
    let ans=0;
    const answer={}

    for(let i = 0; i <= 19; i++){
    const base = new Set();
    
    const rl = readline.createInterface({
        input: fs.createReadStream(`06_INSTAGRAM_GIVEAWAY\\out${i}.txt`),  
    });
    for await (const line of rl) {
        base.add(line);
    }
    base.forEach((line) => {
        if (!answer.hasOwnProperty(line)) {
            answer[line]=1;
        }
        else{
            
            if (answer[line]<=10){
                answer[line]+=1;
            

            if(answer[line]==10){
                ans+=1;
            }
            }
        }
    })
    
    }
    console.log("Names in at least 10 Files: "+ans)
    // base.clear();
    // base.add(unique.values());
    
    

}
async function create_uniq(){
    const base = new Set();
    for(let i = 1; i <= 19; i++){
    const rl = readline.createInterface({
        input: fs.createReadStream(`06_INSTAGRAM_GIVEAWAY\\out${i}.txt`),
      
      });
      

      for await (const line of rl) { 
        base.add(line);
      };

    }

    console.log("Number of unique names: "+base.size)
}


async function start(){
    await Promise.allSettled([create_uniq(), create_10(), create()]);
    console.timeEnd("Time consumed");
}

start()
          

 
 
 



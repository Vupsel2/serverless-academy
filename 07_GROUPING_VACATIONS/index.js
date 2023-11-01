const fs = require('fs').promises;
let jsonObject
let newjs=[];
const unique_names = {};
let m = 0;
async function readjs(){
    const data= await fs.readFile("07_GROUPING_VACATIONS/example.json", 'utf8')
    jsonObject = JSON.parse(data);
    

for (const line of jsonObject){
    
    if (isNaN(unique_names[line.user.name])) {
        
        newjs.push({"userID":line.user._id,"userName":line.user.name,vacations:[{
            "startDate":line.startDate,"endDate":line.endDate
          }]});
        
        unique_names[line.user.name] = m;
        m++;
        //console.log(unique_names);
      }
      
    else{

        newjs[unique_names[line.user.name]].vacations.push({
            "startDate":line.startDate,"endDate":line.endDate
          })

    }
    
    }
  
    console.log(newjs);
    const jsonStr = JSON.stringify(newjs, null, 2);
    await fs.writeFile('07_GROUPING_VACATIONS\\example.json', jsonStr, 'utf8');

}

readjs()
 
const inquirer = require('inquirer');
const DB = [];
const readline = require('readline');
const fs = require('fs');


function name(){
    inquirer

    .prompt([
        
        {
            type: 'input', 
            name: 'name', 
            message: "Enter user's name(Press ENTER to stop):",
            
            
        }
    ])
    .then((answers) => {
        if(answers.name){
            other(answers.name);
            }
            else{out();}

        })
        
    }

function other(name1){
        inquirer
        .prompt([
        {
            type: 'list', 
            name: 'gender', 
            message: 'Choose your gender.',
            choices: ['male', 'female'] 
        },
        {
            type: 'number', 
            name: 'age', 
            message: 'Enter your age:'
            
        }
        
        
    ])
            
    .then((answers) => {
        const ageString = answers.age.toString();
        const tuple={
            user:name1,
            gender:answers.gender,
            age:ageString
        }

        
        const tuple1="\n"+JSON.stringify(tuple);
        fs.appendFile('C:\\Users\\Я\\Desktop\\jss\\serverless-academy\\02_CLI_PRIMITIVE_DB\\DB.txt',tuple1,{ encoding: 'utf8' }, (err) => { if (err) {
            console.error(err);}});
        name();
    })
}
function out(){
    const rl = readline.createInterface({
        input:fs.createReadStream('C:\\Users\\Я\\Desktop\\jss\\serverless-academy\\02_CLI_PRIMITIVE_DB\\DB.txt'),
        
    });
    rl.on('line', (line) => {
    line = JSON.parse(line);
    DB.push(line);
    
    });
    inquirer
    .prompt([
    {
        type: 'confirm', 
        name: 'confirmation', 
        message: 'Would you search values in DB:'
        
    }])
    .then((answers) => {
        if(answers.confirmation){
            console.log(DB)
            inquirer
            .prompt([
                {
                    type: 'input', 
                    name: 'sname', 
                    message: "Enter user's name you wanna find:"
                    
                }])
                .then((answers) => {
                    found=false;
                    for(let i=0;i<DB.length;i++){
                        if(DB[i].user===answers.sname||DB[i].user.toUpperCase()===answers.sname||DB[i].user.toLowerCase()===answers.sname){
                            console.log("User "+DB[i].user+" had been found")
                            console.log(DB[i])
                            found=true;
                        }}
                if(!found){
                    console.log(("User "+answers.sname+" does not exist in DB"))}
                })
        }
        
    })
    
}
name();

    
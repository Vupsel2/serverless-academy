const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var Text= ''
const words= []
const digits= []

function qes1(){
  rl.question('Hello. Write 10 words or digits devidind them in spaces: ', (input) => {
    Text=input.split(" ");
    qes2();
    
  });
}

function qes2(){
  console.log("");
  console.log("         CHOOSE TYPE OF SORTING");
  console.log("");
  console.log("1. Words by name A-Z.");
  console.log("2. Show digits from the smallest.");
  console.log("3. Show digits from the biggest.");
  console.log("4. Words by quantity of leters(smaller => bigger amount).");
  console.log("5. Only unique words.");
  rl.question('Choose option 1-5(type "Quit" to stop): ', (input) => {
    
    if (digits.length===0){
      if(input == 2 || input == 3){
        for (const element of Text) { if (!isNaN(element)){ digits.push(element)}}
    }}
    if (words.length===0){
      if (input == 1 || input == 4 || input == 5) {
        for (const element of Text) {if (isNaN(element)){ words.push(element)}}
    }}
    switch(input){
      case '1': AZ(); break;
      case '2': smallest(); break;
      case '3': biggest(); break;
      case '4': letters(); break;
      case '4': letters(); break;
      case '5': unique(); break;
      case 'Quit': quit(); break;
      default: console.log("Only 1-5 or 'Quit'"); qes2(); 
    }
    
  });
}
function AZ(){
  words.sort();
  console.log(words)
  qes2();
}
function smallest(){
  digits.sort(function (a, b) {
    return a-b;
  });
  console.log(digits)
  qes2();
}
function biggest(){
  digits.sort(function (a, b) {
    return b-a;
  });
  console.log(digits)
  qes2();
}
function letters(){
  words.sort(function (a, b) {
    return a.length-b.length;
  });
  console.log(words)
  qes2();
}
function unique(){
  console.log([...new Set(words)]);
  qes2();
}
function quit(){
  console.log("Bye!")
  rl.close();
}

qes1();
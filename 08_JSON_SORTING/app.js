const axios = require('axios');

const endpoints=["https://jsonbase.com/sls-team/json-793",
'https://jsonbase.com/sls-team/json-955',
'https://jsonbase.com/sls-team/json-231',
'https://jsonbase.com/sls-team/json-931',
'https://jsonbase.com/sls-team/json-93',
'https://jsonbase.com/sls-team/json-342',
"https://jsonbase.com/sls-team/json-770",
'https://jsonbase.com/sls-team/json-491',
"https://jsonbase.com/sls-team/json-281",
"https://jsonbase.com/sls-team/json-718",
'https://jsonbase.com/sls-team/json-310',
"https://jsonbase.com/sls-team/json-806",
'https://jsonbase.com/sls-team/json-469',
'https://jsonbase.com/sls-team/json-258',
'https://jsonbase.com/sls-team/json-516',
'https://jsonbase.com/sls-team/json-79',
'https://jsonbase.com/sls-team/json-706',
'https://jsonbase.com/sls-team/json-521',
'https://jsonbase.com/sls-team/json-350',
'https://jsonbase.com/sls-team/json-64'];

async function readjs() {
    for (const line of endpoints) {
      let success = false;
      let retries = 1;
  
      while (!success && retries <= 3) {
        try {
          const response = await axios.get(line);
          console.log("[Success] " + line + ': IsDone - ' + response.data.ISDone);
          success = true;
        } catch (error) {
            if(retries ==3) {
          console.log("[Fail] " + line + ": the endpoint is unavailable");
            }
          retries++;

        }
      }
    }
  }
  
  readjs();
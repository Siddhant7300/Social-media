const express = require('express');
const dbconnect = require('./dbconnect');
const app = express();



app.get('/',(req,res)=>{
    res.send('Hello World');
})

dbconnect();
app.listen(4000,function(){
    console.log("Listening on port 4000");
});

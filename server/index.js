const express = require('express')

const app = express();

const PORT = 3000;

app.get('/',(req,res)=>{
    console.log(typeof req)
    res.send(JSON.stringify(req))
})

app.listen(PORT,()=>{console.log(`Server started at ${PORT}`)})

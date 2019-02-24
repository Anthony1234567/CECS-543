const express = require('express')
const app = express()
app.use(express.json())

app.get('/',(req,res,next)=>{
    res.send("Hello World");
    res.end();
})
app.post('/create', (req,res,next)=>{

})
app.post('/create', (req,res,next)=> {

})

const port = process.env.port || 3000;
app.listen(port, ()=> console.log(`Listen to port ${port}`));
//Import libraries 
const express = require('express');
const path = require('path');
const VCS = new (require('./src/js/VCS'))

//Initalize varaibles
const app = express();
app.use(express.json());
app.use('/css', express.static(path.join(__dirname, "src/frontend/css")));
app.use('/js', express.static(path.join(__dirname, "src/frontend/js")));


//Homepage
app.get('/', (req, res, next) => {
    res.sendFile('src/frontend/html/controller.html', { root: __dirname });
})

//Create route
app.post('/create', (req, res, next) => {
    try {
        let sourceDirectory = req.body.sourceDirectory;
        //VCS does something here...

        res.status(201).end();
    } catch (err) {
        res.status(400).end();
    }
})

//Commit route
app.post('/commit', (req, res, next) => {
    try {
        let sourceDirectory = req.body.sourceDirectory;
        //VCS does something here...

        res.status(200).end();
    } catch (err) {
        res.status(400).end();
    }
})

//Port to list to
const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listen to port ${port}`));
/**
* @author: Chandandeep Thind, Sotheanith Sok, Anthony Martinez 
* @email: chandandeep.thind@student.csulb.edu, sotheanith.sok@student.csulb.edu, anthony.martinez02@student.csulb.edu 
* @description: This module contains Express routing services provided by this application. It is reponsible
* for serving necessary files and handling incoming HTTP requests. 
*/


/**
 * Import libraries.
 */
const express = require('express');
const path = require('path');
const VCS = require('./src/js/VCS')

/**
 * Initialize variables.
 */
const app = express();
app.use(express.json());
app.use('/css', express.static(path.join(__dirname, "src/frontend/css")));
app.use('/js', express.static(path.join(__dirname, "src/frontend/js")));


/**
 * Homepage routes.
 */
app.get('/', (req, res, next) => {
    res.sendFile('src/frontend/html/controller.html', { root: __dirname });
})

/**
 * Create route.
 */
app.post('/create', (req, res, next) => {
    try {
        let sourceDirectory = req.body.sourceDirectory;
        console.log('source directory: ' + sourceDirectory);
        new VCS(sourceDirectory).init();
        res.status(201).end();
    } catch (err) {
        console.log('error: ' + err);
        res.status(400).end();
    }
})

/**
 * Commit route.
 */
app.post('/commit', (req, res, next) => {
    try {
        let sourceDirectory = req.body.sourceDirectory;
        new VCS(sourceDirectory).commit();
        res.status(200).end();
    } catch (err) {
        res.status(400).end();
    }
})

/**
 * Checkout route.
 */
app.post('/checkout',(req,res,next)=>{
    try{
        let sourceDirectory=req.body.sourceDirectory;
        let targetDirectory=req.body.targetDirectory;
        new VCS(sourceDirectory).checkout(targetDirectory)
        res.status(200).end();
    }catch (err){
        res.status(400).end();
        console.log(err);
    }
});


/**
 * Port to listen to.
 */
const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listen to port ${port}`));

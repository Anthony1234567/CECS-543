

//imports 
const fs = require("fs");
const check = require("check-types");
const path = require('path');

class Manifest {

    constructor(p) {
        //check parameters
        if (!check.nonEmptyString(p)) {
            throw new Error("Invalid path to a directory");
        }

        //check if folder exist
        let isExist = fs.existsSync(path.resolve(p));
        let isDirectory = fs.isDirectory(path.resolve(p));
        if (!isExist || !isDirectory) {
            throw new Error("Directory does not exist.");
        }

        //Build the path
        this._path = path.resolve(p, "/Manifests");

        //Make directory if it doesn't exist
        isExist = fs.existsSync(this._path);
        if (!isExist) {
            fs.mkdirSync(this._path);
        }

        let readFiles = fs.readdirSync(this._path, { withFileTypes: "true" });
        let files = readFiles.filter(item => item.isFile());
        files.forEach((file) => {
            let obj = readFile(file.name);
            switch (obj.type) {
                case "commit":
                    this._commits.push(obj);
                    break;
                case "checkin":
                    this._checkins.push(obj);
                    break;
                case "checkout":
                    this._checkouts.push(obj);
                    break;
                default:
                    throw new Error("Unknow file type");
            }
        })

    }

    createCommit(){

    }

    createCheckin(){

    }

    createCheckout(){

    }

    updateCommit(){

    }


    getItem(){
        
    }

    isItemExist(){

    }


    readFile(fileName) {
        return JSON.parse(fs.readSync(path.resolve(this._path, fileName)));
    }


    writeFile(fileName, value) {
        fs.writeFile(path.join(this._path, fileName), JSON.stringify(value));
    }
}
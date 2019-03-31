

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

        this._commits = [];
        this._checkins = [];
        this._checkout = [];
        this._root = path.join(p, "../")
        this._path = path.resolve(path.join(p, "/Manifests"));
        this._pathExisted = false;

        //check if folder exist
        let isExist = fs.existsSync(this._path);

        //If it exist, begin reading the files
        if (isExist) {
            let readFiles = fs.readdirSync(this._path, { withFileTypes: "true" });
            let files = readFiles.filter(item => item.isFile());
            files.forEach((file) => {
                let obj = this.readFile(file.name.slice(0, -5));
                switch (obj.command) {
                    case "commit":
                        this._commits.push(obj.id);
                        break;
                    case "checkin":
                        this._checkins.push(obj.id);
                        break;
                    case "checkout":
                        this._checkouts.push(obj.id);
                        break;
                    default:
                        throw new Error("Unknown file type");
                }
            })
        }

    }

    createCommit(id, values, author, description, tag) {
        //Parameters checking
        if (!check.nonEmptyString(id)) {
            throw new Error("Id must be a string");
        }

        if (!check.nonEmptyArray(values) && !check.nonEmptyString(values)) {
            throw new Error("Values be a non-empty string or non-empty array");
        }
        if (check.nonEmptyString(tag)) {
            tag = [tag];
        }

        let obj = {
            id: id,
            argument: this._root,
            author: (check.nonEmptyString(author)) ? author : null,
            description: (check.nonEmptyString(description)) ? description : null,
            tag: (check.nonEmptyArray(tag)) ? tag : null,
            values: (check.nonEmptyArray(values)) ? values : [values],
            created: Date.now(),
            lastUpdated: Date.now(),
            command: "commit"
        };

        this._commits.push(obj.id);
        this.writeFile(obj.id, obj);
    }

    createCheckin() {

    }

    createCheckout() {

    }

    updateCommit(id, field, value) {
        if (!field === "author" && !field === "description" && !field === "tag" && !field === "values") {
            throw new Error("Unknown field");
        }
        if (this._commits.indexOf(id) <= -1) {
            throw new Error("The target object isn't a commit")
        }

        let obj = this.readFile(id);

        switch (field) {
            case "values":
                if (check.nonEmptyArray(obj.values)) {
                    obj.values.push(value);
                } else {
                    obj.values = [value];
                }
                break;
            default:
                obj[field] = value;
        }

        this.writeFile(obj.id, obj);
    }

    getItem(id) {
        return this.readFile(id);
    }

    isItemExist(id) {
        return (this._commits.indexOf(id) > -1);
    }


    readFile(fileName) {
        return JSON.parse(fs.readFileSync(path.resolve(this._path, fileName + ".json")));
    }


    writeFile(fileName, value) {
        if (!this._pathExisted) {
            if (!fs.existsSync(this._path)) {
                fs.mkdirSync(this._path);
                this._pathExisted = true;
            }
        }
        fs.writeFileSync(path.join(this._path, fileName + ".json"), JSON.stringify(value, null, 4));
    }
}
module.exports = Manifest;
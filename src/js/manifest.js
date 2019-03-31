/**
* @author: Sotheanith Sok
* @email: sotheanith.sok@student.csulb.edu
* @description: This module provides functionality that allows the generation
* and updation of manifest file.  
*/

//imports 
const fs = require("fs");
const check = require("check-types");
const path = require('path');

/**This is a manifest object contains information related the distribution of artifacts of each files.*/
class Manifest {

    /**
     * The default contstructor.
     * @param {string} p Path to the location of manifest files
     */
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
                let obj = this.readFile(file.name.slice(0, -5));//Remove extension from files
                switch (obj.command) {
                    case "commit":
                        this._commits.push(obj.id); //Push commits item into its array
                        break;
                    case "checkin":
                        this._checkins.push(obj.id);//Push checkins item into its array
                        break;
                    case "checkout":
                        this._checkouts.push(obj.id);//Push checkouts item into its array
                        break;
                    default:
                        throw new Error("Unknown file type");
                }
            })
        }

    }

    /**
     * Create a commit.
     * @param {String} id Unique identifer for this commit.
     * @param {Array | String} values Values for this commit.
     * @param {String} author Author of this commit. (Optional)
     * @param {String} description Desciption of this commit. (Optional)
     * @param {Array | String} tag Tag for this commit. (Optional)
     */
    createCommit(id, values, author, description, tag) {
        //Parameters checking
        if (!check.nonEmptyString(id)) {
            throw new Error("Id must be a string");
        }
        if (!check.nonEmptyArray(values) && !check.nonEmptyString(values)) {
            throw new Error("Values be a non-empty string or non-empty array");
        }

        //Data formatting
        if (check.nonEmptyString(tag)) {
            tag = [tag];
        }

        //Create commit object
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

        this._commits.push(obj.id); //Push the new object to commits array
        this.writeFile(obj.id, obj); //Write object to storage
    }

    /**
     * Create a checkin.
     * @param {String} id Unique identifer for this checkin.
     * @param {String} source Source of this checkin.
     * @param {String} author Author of this checkin. (Optional)
     * @param {String} description Description of this checkin. (Optional)
     * @param {Array | String} tag Tag of this checkin. (Optional)
     */
    createCheckin(id, source, author, description, tag) {
        //Parameters checking
        if (!check.nonEmptyString(id)) {
            throw new Error("Id must be a string");
        }
        if (!check.nonEmptyString(target)) {
            throw new Error("Target be a non-empty string or non-empty array");
        }

        //Data formatting
        if (check.nonEmptyString(tag)) {
            tag = [tag];
        }

        //Create commit object
        let obj = {
            id: id,
            argument: {
                source: source,
                target: this._root
            },
            author: (check.nonEmptyString(author)) ? author : null,
            description: (check.nonEmptyString(description)) ? description : null,
            tag: (check.nonEmptyArray(tag)) ? tag : null,
            created: Date.now(),
            lastUpdated: Date.now(),
            command: "checkin"
        };

        this._checkins.push(obj.id); //Push the new object to checkouts array
        this.writeFile(obj.id, obj); //Write object to storage
    }

    /**
     * Create a checkout.
     * @param {String} id Unique identifer of this checkout.
     * @param {String} target Target of this checkout.
     * @param {String} author Author of this checkout. (Optional)
     * @param {String} description Description of this checkout. (Optional)
     * @param {Array | String} tag Tag of this checkout. (Optional)
     */
    createCheckout(id, target, author, description, tag) {
        //Parameters checking
        if (!check.nonEmptyString(id)) {
            throw new Error("Id must be a string");
        }
        if (!check.nonEmptyString(target)) {
            throw new Error("Target be a non-empty string or non-empty array");
        }

        //Data formatting
        if (check.nonEmptyString(tag)) {
            tag = [tag];
        }

        //Create commit object
        let obj = {
            id: id,
            argument: {
                source: this._root,
                target: target
            },
            author: (check.nonEmptyString(author)) ? author : null,
            description: (check.nonEmptyString(description)) ? description : null,
            tag: (check.nonEmptyArray(tag)) ? tag : null,
            created: Date.now(),
            lastUpdated: Date.now(),
            command: "checkout"
        };

        this._checkout.push(obj.id); //Push the new object to checkouts array
        this.writeFile(obj.id, obj); //Write object to storage
    }

    /**
     * Update commit.
     * @param {String} id Unique indetifer of a commit.
     * @param {"author" | "description" | "tag" | "values"} field Field of the commit to modify.
     * @param {Array | String} value A new value of the field.
     */
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
        obj.lastUpdated = Date.now();

        this.writeFile(obj.id, obj);
    }

    /**
     * Get a manifest.
     * @param {String} id Unique identifer of a manifest.
     * @returns Manifest object.
     */
    getItem(id) {
        if (this.isItemExist(id)) {
            return this.readFile(id);
        } else {
            return undefined;
        }
    }

    /**
     * Check if a manifest exist.
     * @param {String} id
     * @returns True/False. 
     */
    isItemExist(id) {
        return (this._commits.indexOf(id) > -1) || (this._checkins.indexOf(id) > -1) || (this._checkouts.indexOf(id) > -1);
    }

    /**
     * Read a manifest from storage.
     * @param {String} fileName 
     * @returns Manifest object.
     */
    readFile(fileName) {
        return JSON.parse(fs.readFileSync(path.resolve(this._path, fileName + ".json")));
    }

    /**
     * Write a manifest to storage.
     * @param {String} fileName Filename. 
     * @param {Object} value Manifest object.
     */
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
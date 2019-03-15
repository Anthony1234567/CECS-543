/**
 * @author: Sotheanith Sok
 * @email: sotheanith.sok@student.csulb.edu
 * @description: This module provides functionality that allows the generation
 * and updation of manifest file.  
 */


/**
 * Imports
 */
const fs = require('fs')
const crypto = require('crypto')

/**This is a manifest object contains information related the distribution of artifacts of each files.*/
class Manifest {

    /**
     * A default constructor 
     * @param {string} path 
     */
    constructor(path) {
        if (isString(path)) {
            this._path = path;
            this._content = readFromFile(path);
        } else {
            throw new Error('Path must be a string.')
        }

    }

    /**
     * Getter for path
     */
    get path() {
        return this._path;
    }

    /**
     * Setter for path
     */
    set path(input) {
        this._path = input;
    }

    /**
     * Get the content of this manifest. 
     */
    get content() {
        return JSON.parse(JSON.stringify(this._content));
    }

    createEntry(id, author, description, type, tag, value) {

        //Type checking
        if (!isString(id) && !isNumber(id)) {
            throw new Error('id must be a string or a number');
        }
        if (this._content[id] != undefined) {
            throw new Error('entry already existed');
        }
        if (!isString(author)) {
            throw new Error('author must be a string');
        }
        if (!isString(description)) {
            throw new Error('description must be a string');
        }
        if (!isString(type)) {
            throw new Error('Type must be string');
        } else if (type != 'commit' && type != 'checkin' && type != 'checkout') {
            throw new Error('Invalid type for the provided entry');
        }

        if ((type == 'checkin' || type === 'checkout') && !isString(value)) {
            throw new Error('value must be a string for checkin type or checkout type');
        }

        //Data formating and verification
        if (!isArray(tag)) {
            tag = [tag];
        }

        if (type === 'commit' && !isArray(value)) {
            value = [value];
        }

        if (type === 'checkin') {
            if (this._content[value] === undefined) {
                throw new Error('Checkout does not exist')
            } else {
                //Verify that checkout is corresponding with the checkin
                const hash = crypto.createHash('sha256');
                hash.update(value);
                let temp = hash.digest('hex');
                if (id != temp) {
                    throw new Error('Invalid checkin and checkout pair')
                }
            }
        }

        if (type === 'checkout') {
            const hash = crypto.createHash('sha256');
            hash.update(id.toString(10));
            value = hash.digest('hex');
        }

        //Create object
        this._content[id] = {
            id: id,
            author: author,
            description: description,
            type: type,
            created: Date.now(),
            lastUpdated: Date.now(),
            tag: tag,
            value: value
        }
        return this._content[id];

    }

    getEntry(id) {
        return this._content[id];
    }

    updateEntry(id, field, value) {
        //Type checking
        if (!isString(id) && !isNumber(id)) {
            throw new Error('id must be a string or a number');
        }
        if (!isString(field)) {
            throw new Error('field must be a string')
        } else if (field != "id" && field != "author" && field != "type" && field != "tag" && field != "value" && field != "description") {
            throw new Error('Unknown field')
        }

        this._content[id].lastUpdated = Date.now();
        switch (field) {
            case "id":
                if (this._content[id].type === "checkin") {
                    throw new Error('You can\'t change the id of checkin entry as it is derived from value. Please change the value instead');
                }
                if (!isString(value) && !isNumber(value)) {
                    throw new Error('For id, value must be a string or a number')
                } else if (id != value) {
                    this._content[id].id = value;
                    if (this._content[id].type === "checkout") {
                        const hash = crypto.createHash('sha256');
                        hash.update(value.toString(10));
                        let temp = hash.digest('hex');
                        this._content[id].value = temp;
                    }
                    this._content[value] = this._content[id];
                    delete this._content[id];
                }
                break;
            case "author":
                if (!isString(value)) {
                    throw new Error('For author, value must be a string');
                }
                this._content[id].author = value;
                break;
            case "description":
                if (isString(value)) {
                    this._content[id].description = value;
                } else {
                    throw new Error("For description, value must be a string")
                }
                break;
            case "type":
                if (!isString(value)) {
                    throw new Error('For type, value must be a string');
                } else if (value != "commit" && value != "checkin" && value != "checkout") {
                    throw new Error('Invalid value provided for type field')
                }
                this._content[id].type = value;
                break;
            case "tag":
                if (isString(value)) {
                    this._content[id].tag.push(value);
                } else if (isArray(value)) {
                    this._content[id].tag = value;
                } else {
                    throw new Error('For tag, value must be a string or an array')
                }
                break;
            default:
                if (this._content[id].type === "commit") {
                    if (isString(value)) {
                        this._content[id].value.push(value);
                    } else if (isArray(value)) {
                        this._content[id].value = value;
                    } else {
                        throw new Error("For commit, value must be a string or an array")
                    }
                } else if (this._content[id].type === "checkin") {
                    if (isString(value)) {
                        const hash = crypto.createHash('sha256');
                        hash.update(value.toString(10));
                        let temp = hash.digest('hex');
                        if (this._content[id].id != temp) {
                            this._content[id].value = value;
                            this._content[id].id = temp;
                            this._content[temp] = this._content[id];
                            delete this.content[id];
                        }
                    } else {
                        throw new Error("For checkin, value must be a string")
                    }

                } else {
                    throw new Error('You can\'t change the value of checkout entry as it is derived from id. Please change id instead.');
                }
        }


    }

    deleteEntry(id) {
        let temp = this._content[id];
        delete this._content[id];
        return temp;
    }


}

/**
 * A synchronous reading of the JSON formatted file.  
 * @param {string} filePath 
 */
function readFromFile(filePath) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath);
        return JSON.parse(content);
    } else {
        return {};
    }

}

/**
 * An synchronous writing of an object into a file.
 * @param {string} filePath 
 * @param {object} object 
 */
function writeToFile(filePath, object) {
    let j = JSON.stringify(object, null, 1);
    // fs.writeFile(filePath, j, (err) => {
    //     if(err){
    //         console.log(err);
    //     }
    // })
    fs.writeFileSync(filePath, j);
}

/**
 * Check if the input is a string.
 * @param {*} input 
 */
function isString(input) {
    if (typeof input === 'string' || input instanceof String) {
        return true;
    } else {
        return false;
    }
}

/**
 * Check if the input is a number.
 * @param {*} input 
 */
function isNumber(input) {
    if (typeof input === 'number' || input instanceof Number) {
        return true;
    } else {
        return false;
    }
}

/**
 * Check if the input is an array.
 * @param {*} input 
 */
function isArray(input) {
    if (Array.isArray(input)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Expose the manifest class for external usage. 
 */
module.exports = Manifest;
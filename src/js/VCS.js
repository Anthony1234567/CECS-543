/**
* @author: Anthony Martinez
* @email: anthony.martinez02@student.csulb.edu
* @description: This module contains the implementation of version control system functinoalities 
* including intitalization, commit, and so on. It uses functionalities provided by the manifest and ArtifactIdService moduels.
*/


// Required modules
const fs = require('fs'); // source: https://nodejs.org/api/fs.html
const artifactIdService = require('./ArtifactIdService'); // For generating ArtifactId of file
const manifest = require('./Manifest'); // For tracking
const crypto = require('crypto'); // Generating commit Id
const path = require('path'); //use to resolve and normalize path to an absolute value

/*
 * @description: Initialization method. 
 *               Creates vcs hidden subdirectory for tracking changes
 *               Copies main directory contents into vcs and creates artifact structure
 */ 
VCS.prototype.init = function() {
    fs.readdir(this.sourceRoot, { withFileTypes: true }, (error, directoryContents) => {
        // TODO: Implement some error handling
        if (error) { throw error; }

        if (directoryContents.find((file) => file.name === this.vcsFileName)) {
            console.error('Init failed: This directory has already been initialized.');
        } else {
            console.log('Initializing repository...');

            const targetRoot = this.sourceRoot + '/' + this.vcsFileName;

            fs.mkdir(targetRoot, (error) => {
                // TODO: Implement some error handling
                if (error) { throw error; }

                this.breadthFirstTraverse(this.sourceRoot, targetRoot, true);
            });
        }
    });
};

/*
 * @description: Commit method. 
 *               Creates vcs hidden subdirectory for tracking changes
 */ 
VCS.prototype.commit = function() {
    fs.readdir(this.sourceRoot, { withFileTypes: true }, (error, directoryContents) => {
        // TODO: Implement some error handling
        if (error) { throw error; }

        if (!directoryContents.find((file) => file.name === this.vcsFileName)) {
            console.error('Commit failed: Directory has not been initialized.');
        } else {
            console.log('Committing changes...');

            this.breadthFirstTraverse(this.sourceRoot, this.sourceRoot + '/' + this.vcsFileName, false);
        }
    });
};

function VCS(sourceRoot) {
    this.sourceRoot = sourceRoot; 
    this.vcsFileName = '.psa'; // VSC file [target] name
    this.manifest = new manifest(this.sourceRoot + '/' + this.vcsFileName + '/' + 'Manifest.json');
    this.commitId = crypto.randomBytes(8).toString('hex');

    /*
    * @description: Implements simplified Breadth-first search recursive 
    *               algorithm to traverse project tree
    *               - Initial traversal through project tree (no .git/.vsc subdirectory)
    *                 meathod will create subdirectory [target] and replicate contents of 
    *                 source into it replacing files with artifact structures
    *               - For commits, meathod looks for .git/.vcs subdirectory to use as target
    * @param: sourceRoot - path to source directory root
    * @param: targetRoot - path to target directory root
    * @param: fullCopy - if true, copy the entire structure of source to target.
    *                    Otherwise only the creates an artifact 
    * Source: https://en.wikipedia.org/wiki/Breadth-first_search
    */ 
    this.breadthFirstTraverse = function(sourceRoot, targetRoot, fullCopy) {
        console.log('sourceRoot: ' + sourceRoot);
        console.log('targetRoot: ' + targetRoot);
        
        // Assume top level root is a directory
        // Can ensure all subsequent calls will be made on directories 
        // thanks to fs.readdir option parameter which can help 
        // get file types along with contents.
        fs.readdir(sourceRoot, { withFileTypes: true }, (error, directoryContents) => {
            // TODO: Implement some error handling
            if (error) { throw error; }
            
            directoryContents.forEach((fileOrDirectory) => { 
                console.log('fileOrDirectory: ' + fileOrDirectory.name);

                // Ignore system files
                if (!fileOrDirectory.name.startsWith('.')) {
                    // Assume file can be one of two things
                    // A file, or a directory.
                    if (fileOrDirectory.isDirectory()) {
                        console.log('directory: ' + fileOrDirectory.name);
                        
                        const source = sourceRoot + '/' + fileOrDirectory.name;
                        const target = targetRoot + '/' + fileOrDirectory.name;

                        if(fullCopy) {
                            fs.mkdir(target, (error) => {
                                // TODO: Implement some error handling
                                if (error) { throw error; }

                                this.breadthFirstTraverse(source, target, fullCopy);
                            });
                        } else {
                            this.breadthFirstTraverse(source, target, fullCopy);
                        }
                    } else {
                        console.log('file: ' + fileOrDirectory.name);

                        const fileName = fileOrDirectory.name; // Remove file extension
                        const sourceFile = sourceRoot + '/' + fileOrDirectory.name;
                        const targetDirectory = targetRoot + '/' + fileName;
                        const targetArtifact = targetRoot + '/' + fileName + '/' + artifactIdService.artifactID(sourceFile) + '.txt'; // Build artifactId
                        
                        if(this.manifest.isEntryExist(this.commitId)){
                            this.manifest.updateEntry(this.commitId,"value",path.resolve(targetArtifact));
                        }else{
                            this.manifest.createEntry(this.commitId,"","","commit", "",path.resolve(targetArtifact));
                        }
                        if(fullCopy) {
                            // Create directory with name of file
                            fs.mkdir(targetDirectory, (error) => {
                                // TODO: Implement some error handling
                                if (error) { throw error; }

                                // Move file into new directory
                                // Replace file name with artifactId    
                                fs.copyFile(sourceFile, targetArtifact, fs.constants.COPYFILE_EXCL, (error) => {
                                    // TODO: Implement some error handling
                                    if (error) { throw error; }
                                });
                            });
                        } else {
                            fs.access(targetArtifact, (isFileDNE) => {
                                if (isFileDNE) {
                                    // Move file into new directory
                                    // Replace file name with artifactId    
                                    fs.copyFile(sourceFile, targetArtifact, fs.constants.COPYFILE_EXCL, (error) => {
                                        // TODO: Implement some error handling
                                        if (error) { throw error; }
                                    });
                                } else {
                                    console.log('Target Artifact already exists for this version of source: ' + sourceFile + '. No new artifact will be created for this file.');
                                }
                            });
                        }
                    }
                }
            });
        });
    }
}

module.exports = VCS;

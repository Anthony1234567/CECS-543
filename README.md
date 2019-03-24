# CECS 543 - Project 1: Version Control System

## Team PSA
- Sotheanith Sok
- Anthony Martinez
- Chandandeep Thind 
- Prateechi Singh
- Yashua Ovando

## Intro
This is the initial iteration of the version control system build by Team PSA. The goal of this iteration is to build a strong foundation in which subsequent iteration can be built upon. As such, the current version of this system only offer users an ability to create a new repository and commit changes to such a repository. Even though this product, in its current iteration, offers only a minimal feature set, it is still a functional product that accomplishes its goal without any error and it has a great users’ experience.

### External Requirements:
- Node JS (10.15.1)
- Express (4.16.4) 
- Browserify (16.2.3)

### Setup and Installation:
1. Manually install Node JS
2. Run “npm install” to install all necessary dependencies
3. Run “node index.js” to start the application

### Sample Invocation and Results
- Invocation 1 - Create Repository
➢ Start the application by running “node index.js” from a command line ➢ Open your favorite browsers
➢ Go to: ​http://localhost:3000/
➢ Enter the source directory in the file provided
➢ Press the “Create” button
- Invocation 1 - Result: a hidden folder name “.PSA” will be created inside the source directory. This folder will contain artifacts, folder structure of the source directory, and the manifest file.
- Invocation 2 - Commit changes to an existing repository
➢ Start the application by running “node index.js” from a command line ➢ Open your favorite browsers
➢ Go to: ​http://localhost:3000/
➢ Enter the source directory in the file provided
➢ Press the “Commit” button
- Invocation 2 - Result: The artifacts, folder structures, and the manifest file, in the “.PSA” folder,” will be updated to reflect the latest change in the source directory.
Features (both included and missing)
- Included
➢ Create a new repository
➢ Commit a new iteration to the repository ❖ Missing
➢ User authentication ➢ Directory Explorer
➢ Partial deletion of a commit
➢ Revert commit
➢ Ability to edit files
➢ Support for different file formats ➢ Branching system
➢ Merging system
➢ Issues board
➢ Allowing the creation of files from the browser
➢ Pull request for reviewing change before merging ➢ Collaboration system
➢ Contribution history of collaborators
➢ Email notification of a change to all collaborators

## Known Issues
None

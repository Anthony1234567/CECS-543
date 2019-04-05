/**
* @author: Prateechi Singh
* @email: prateechi.singh@student.csulb.edu
* @description: This is the javascript file for the controller.html and it contains functionalites necessary
* for such html file. However, this file will not work in the browser as it still needs to go through conversion process
* to make it browser compatible.  
*/


//Library
const request = require('request').defaults({ baseUrl: 'http://localhost:3000/', json: true })

/**
 * Make to http call to create a new repository.
 */
function create() {
	request.post('/create', {
		body: {
			sourceDirectory: document.getElementById('directory-field').value
		}
	}, (err, req, body) => {
		if (!err) {
			window.location.href = '/html/main.html?projectRoot=' + encodeURIComponent(document.getElementById('directory-field').value);
		}
	})
}

/**
 * Make a http call to create a new commit for a given repository.
 */
function commit() {
	request.post('/commit', {
		body: {
			sourceDirectory: document.getElementById('directory-field').value
		}
	}, (err, req, body) => {
		if (!err) {
			if (req.statusCode === 200) {
				window.alert("Successfully created a commit.");
			}
			else {
				window.prompt("Failed to create a commit.");
			}
		}
	})

}

module.exports = {
	create: create,
	commit: commit
}
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
			if (req.statusCode === 201) {
				window.alert("Successfully created a reponsitory.");
			}
			else {
				window.alert("Failed to create a commit.");
			}
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
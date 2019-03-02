const request = require('request').defaults({ baseUrl: 'http://localhost:3000/', json: true })

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
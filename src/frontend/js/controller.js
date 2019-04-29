/**
 * @author: Anthony Martinez, Prateechi Singh, Yashua Ovando
 * @email: anthony.martinez02@student.csulb.edu, prateechi.singh@student.csulb.edu, yashua.ovando@student.csulb.edu
 * @description: This is the javascript file for input.html and main.input and it contains functionalites necessary
 * for such html file. However, this file will not work in the browser as it still needs to go through conversion process
 * to make it browser compatible.  
 */


//Library
const request = require('request').defaults({
	baseUrl: 'http://localhost:3001/',
	json: true
})

/**
 * Make to http call to create a new repository.
 */
function create() {
	request.post('/create', {
		body: {
			sourceDirectory: document.getElementById('directory-field').value
		}
	}, (err, res, body) => {
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
			sourceDirectory: document.getElementById('directory').innerHTML
		}
	}, (err, res, body) => {
		if (!err) {
			if (res.statusCode === 200) {
				window.alert("Successfully created a commit.");
				listManifests();
			} else {
				window.alert("Failed to create a commit.");
			}
		}
	})
}

/**
 * Make a http call to checkin into a repository
 */
function checkIn() {
	request.post('/checkin', {
		body: {
			sourceDirectory: document.getElementById('directory-field').value,
			targetDirectory: document.getElementById('directory').innerHTML
		}
	}, (err, res, body) => {
		if (!err) {
			if (res.statusCode === 200) {
				window.alert("Successfully Checked-In");
				listManifests();
			} else {
				window.alert("Failed to check-in");
			}

		}
	})
}

/**
 * Make a http call to checkout of a given repostiory
 */
function checkout() {
	request.post('/checkout', {
		body: {
			sourceDirectory: document.getElementById('directory').innerHTML,
			targetDirectory: document.getElementById('directory-field').value
		}
	}, (err, res, body) => {
		if (!err) {
			if (res.statusCode === 200) {
				window.alert("Successfully Checked-Out");
				listManifests();
			} else {
				window.alert("Failed to check-out");
			}

		}
	})
}

/**
 * Make a http call to update a manifest
 * @param {*} manifestId commitID
 * @param {*} field which field to makes change to 
 * @param {*} value new values
 */
function updateManifest(manifestId, field, value) {
	request.post('/update', {
		body: {
			sourceDirectory: document.getElementById('directory').innerText,
			id: manifestId,
			field: field,
			value: value
		}
	}, (err, res, body) => {
		if (!err) {
			if (res.statusCode === 200) {
				window.alert("Successfully Updated Commit");
			} else {
				window.alert("Failed to update commit");
			}

		}
	})
}


/**
 * Make a http call to get all manifests and update views based on the return result
 */
function listManifests() {
	request.post('/get/manifests', {
		body: {
			sourceDirectory: document.getElementById('directory').innerHTML
		}
	}, (err, res, body) => {
		if (!err) {
			if (res.statusCode === 200) {
				//Clear old lists
				while (document.getElementById('manifestList').hasChildNodes()) {
					document.getElementById('manifestList').removeChild(document.getElementById('manifestList').childNodes[0]);
				}

				//Update manifest lists
				body.forEach((element) => {
					var temp = document.getElementsByTagName("template")[0];
					var clone = temp.content.cloneNode(true);
					clone.querySelector('h5').id = element.id;

					if (element.tag === null) {
						clone.querySelector('h5').innerText = element.id;
					} else {
						let size = Object.keys(element.tag).length;
						clone.querySelector('h5').innerText = element.tag[size - 1];
					}
					clone.querySelector('button').onclick = function () {
						openModal('Change Label', element.id);
					}
					document.getElementById('manifestList').appendChild(clone);
				})
			} else {
				window.prompt("Failed to check-in");
			}
		}
	})
}

/**
 * Initalize the main.html and it will be call when main.html is loaded
 */
function initalizeMain() {
	// Get the modal
	var modal = document.getElementById('myModal');
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName('close')[0];
	document.getElementById('directory').innerHTML = decodeURIComponent(new URL(window.location.href).searchParams.get('projectRoot'));

	Controller.listManifests();

	// When the user clicks on <span> (x), close the modal
	span.onclick = function () {
		modal.style.display = 'none';
		document.getElementById('directory-field').value = '';
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = 'none';
			document.getElementById('directory-field').value = '';
		}
	}
}

/**
 * Open the modal to allows user to input  value
 * @param {*} type type of model
 * @param {*} manifestId manifest id
 */
function openModal(type, manifestId) {
	switch (type) {
		case 'Check In':
			document.getElementById('directory-field').placeholder = 'Enter Source Directory';
			document.getElementById('actionButton').innerHTML = 'Check In';

			// TODO: Implement call to Controller.checkIn()
			document.getElementById('actionButton').onclick = function () {
				Controller.checkIn();
				Controller.listManifests();
			}

			break;
		case 'Check Out':
			document.getElementById('directory-field').placeholder = 'Enter Target Directory';
			document.getElementById('actionButton').innerHTML = 'Check Out';

			// TODO: Implement call to Controller.checkOut()
			document.getElementById('actionButton').onclick = function () {
				Controller.checkout();
				Controller.listManifests();
			}

			break;
		case 'Change Label':
			document.getElementById('directory-field').placeholder = 'Enter New Label';
			document.getElementById('actionButton').innerHTML = 'Change Label';
			let field = "tag";
			document.getElementById('actionButton').onclick = function () {
				let label = document.getElementById('directory-field').value;
				document.getElementById(manifestId).innerText = label;
				Controller.updateManifest(manifestId, field, label);
				document.getElementById('myModal').style.display = 'none';
				document.getElementById('directory-field').value = '';
			}
			break;
		default:
			console.warn('Unknown Command.');
	}
	document.getElementById('myModal').style.display = 'block';
}

/**
 * Exposed variables and functions
 */
module.exports = {
	create: create,
	commit: commit,
	checkIn: checkIn,
	checkout: checkout,
	listManifests: listManifests,
	updateManifest: updateManifest,
	initalizeMain: initalizeMain,
	openModal: openModal
}
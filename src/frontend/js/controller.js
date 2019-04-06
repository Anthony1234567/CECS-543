/**
* @author: Prateechi Singh
* @email: prateechi.singh@student.csulb.edu
* @description: This is the javascript file for the controller.html and it contains functionalites necessary
* for such html file. However, this file will not work in the browser as it still needs to go through conversion process
* to make it browser compatible.  
*/


//Library
const request = require('request').defaults({ baseUrl: 'http://localhost:3006/', json: true })

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
			sourceDirectory: document.getElementById('directory').innerHTML
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

function checkIn()
{
	request.post('/checkin', {
		body: {
			sourceDirectory: document.getElementById('directory-field').value,
			targetDirectory: document.getElementById('directory').innerHTML
		}
	}, (err, req, body) => {
		if(!err) {
			if (req.statusCode===200) {
			window.alert("Successfully Checked-In");
			}
			else {
			window.prompt("Failed to check-in");
			}
			
		}
	})
}

function checkout()
{
	request.post('/checkout', {
		body: {
			sourceDirectory: document.getElementById('directory').innerHTML,
			targetDirectory: document.getElementById('directory-field').value
		}
	}, (err, req, body) => {
		if(!err) {
			if (req.statusCode===200) {
			window.alert("Successfully Checked-Out");
			}
			else {
			window.prompt("Failed to check-out");
			}
			
		}
	})
}

function updateCommit(manifestId, field, label)
{
	
	request.post('/update/commit', {
		body: {
			sourceDirectory: document.getElementById('directory').innerText,
			id: manifestId,
			field: field,
			value: label

		}
	}, (err, req, body) => {
		if(!err) {
			if (req.statusCode===200) {
			window.alert("Successfully Updated Commit");
			}
			else {
			window.prompt("Failed to update commit");
			}
			
		}
	})
}


function listManifests()
{
	request.post('/get/manifests', {
		body:
			{
				sourceDirectory: document.getElementById('directory').innerHTML
			}
	 	}, (err, req, body) => {
			if(!err) {
				
				if (req.statusCode === 200){

					updatingPage(body);
		
						
				}
				else {
				window.prompt("Failed to check-in");
				}
				
			}
		})
}



function updatingPage(body)
{
	
	for(let i =0; i<body.length; i++)
	{
		var temp = document.getElementsByTagName("template")[0];
		var clone = temp.content.cloneNode(true);
		clone.querySelector('h5').id = body[i].id;
		

		if(body[i].tag === null)
		{
			clone.querySelector('h5').innerText = body[i].id;
		}
		else
		{
			let size = Object.keys(body[i].tag).length;
			clone.querySelector('h5').innerText = body[i].tag[size-1];
		}
		clone.querySelector('button').onclick = function() {
			openModal('Change Label', body[i].id);
		}
		document.getElementById('manifestList').appendChild(clone);
	};
	
}
	

module.exports = {
	create: create,
	commit: commit,
	checkIn: checkIn,
	checkout: checkout,
	listManifests: listManifests,
	updateCommit: updateCommit
}
export const fetchAllCategories = (accessToken) => {
	//Note: we are returning promise so that we can resolve it by using appropriate data type like json or text
	//caller of the function should only be concerned with returned data on success or failure message
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	fetch('http://localhost:8080/api/products/categories', {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + accessToken,
		},
	}).then((response) => {
		response.json().then((json) => {
			json.sort();
			json = ["ALL", ...json];
			if(response.ok) {
				promiseResolveRef({
					data: json,
					response: response,
				});
			} else {
				promiseRejectRef({
					reason: "Server error occurred.",
					response: response,
				});
			}
		});
	}).catch((err) => {
		promiseRejectRef({
			reason: "Some error occurred.",
			response: err,
		});
	});
	return promise;
};
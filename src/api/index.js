export const doLogin = (email, password) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	fetch('http://localhost:8080/api/auth/signin', {
		method: 'POST',
		body: JSON.stringify({
			username: email,
			password: password,
		}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	}).then((response) => {
		response.json().then((json) => {
			if(response.ok) {
				promiseResolveRef({
					username: email,
					accessToken: json.token,
					accessTokenTimeout: Date.now() + 300000,
					// TODO: roles and userid
					roles: ["ADMIN"],
					userId: "64c23ff0ad1739210133a348",
					response: response,
				});
			} else {
				promiseRejectRef({
					reason: "Server error occurred. Please try again.",
					response: response,
				});
			}
		}).catch((error) => {
			promiseRejectRef({
				reason: "Bad Credentials. Please try again.",
				response: error,
			});
		});
	}).catch((err) => {
		promiseRejectRef({
			reason: "Some error occurred. Please try again.",
			response: err,
		});
	});
	return promise;
};

export const doSignup = (requestJson) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	fetch('http://localhost:8080/api/auth/signup', {
		method: 'POST',
		body: JSON.stringify(requestJson),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	}).then((response) => {
		response.json().then((json) => {
			if(response.ok) {
				promiseResolveRef({
					message: json.message,
					response: response,
				});
			} else {
				let message = json.message;
				if(message === undefined || message === null) {
					message = "Server error occurred. Please try again.";
				}
				promiseRejectRef({
					reason: message,
					response: response,
				});
			}
		});
	}).catch((err) => {
		promiseRejectRef({
			reason: "Some error occurred. Please try again.",
			response: err,
		});
	});
	return promise;
};

export const fetchAllCategories = (accessToken) => {
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

export const fetchAllProducts = (accessToken) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	fetch('http://localhost:8080/api/products', {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + accessToken,
		},
	}).then((response) => {
		response.json().then((json) => {
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

export const createProduct = (requestJson, accessToken) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	fetch('http://localhost:8080/api/products', {
		method: 'POST',
		body: JSON.stringify(requestJson),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
			'Authorization': 'Bearer ' + accessToken,
		},
	}).then((response) => {
		response.text().then((json) => {
			if(response.ok) {
				promiseResolveRef({
					message: "Product " + requestJson.name + " added successfully.",
					response: response,
				});
			} else {
				let message = json.message;
				if(message === undefined || message === null) {
					message = "Server error occurred. Please try again.";
				}
				promiseRejectRef({
					reason: message,
					response: response,
				});
			}
		});
	}).catch((err) => {
		promiseRejectRef({
			reason: "Some error occurred. Please try again.",
			response: err,
		});
	});
	return promise;
};

export const deleteProduct = (id, accessToken) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	fetch('http://localhost:8080/api/products/'+id, {
		method: 'DELETE',
		headers: {
			'Authorization': 'Bearer ' + accessToken,
		},
	}).then((response) => {
		response.text().then(() => {
			if(response.ok) {
				promiseResolveRef({
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

export const modifyProduct = (requestJson, accessToken) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	fetch('http://localhost:8080/api/products/' + requestJson.id, {
		method: 'PUT',
		body: JSON.stringify(requestJson),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
			'Authorization': 'Bearer ' + accessToken,
		},
	}).then((response) => {
		response.text().then((json) => {
			if(response.ok) {
				promiseResolveRef({
					message: "Product " + requestJson.name + " modified successfully.",
					response: response,
				});
			} else {
				let message = json.message;
				if(message === undefined || message === null) {
					message = "Server error occurred. Please try again.";
				}
				promiseRejectRef({
					reason: message,
					response: response,
				});
			}
		});
	}).catch((err) => {
		promiseRejectRef({
			reason: "Some error occurred. Please try again.",
			response: err,
		});
	});
	return promise;
};

export const fetchAllAddresses = (accessToken) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	fetch('http://localhost:8080/api/addresses', {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + accessToken,
		},
	}).then((response) => {
		response.json().then((json) => {
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

export const createAddress = (requestJson, accessToken) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	fetch('http://localhost:8080/api/addresses', {
		method: 'POST',
		body: JSON.stringify(requestJson),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
			'Authorization': 'Bearer ' + accessToken,
		},
	}).then((response) => {
		response.text().then((json) => {
			if(response.ok) {
				promiseResolveRef({
					message: "Product " + requestJson.name + " added successfully.",
					response: response,
				});
			} else {
				let message = json.message;
				if(message === undefined || message === null) {
					message = "Server error occurred. Please try again.";
				}
				promiseRejectRef({
					reason: message,
					response: response,
				});
			}
		});
	}).catch((err) => {
		promiseRejectRef({
			reason: "Some error occurred. Please try again.",
			response: err,
		});
	});
	return promise;
};

export const createOrder = (requestJson, accessToken) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	fetch('http://localhost:8080/api/orders', {
		method: 'POST',
		body: JSON.stringify(requestJson),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
			'Authorization': 'Bearer ' + accessToken,
		},
	}).then((response) => {
		response.text().then(() => {
			if(response.ok) {
				promiseResolveRef({
					response: response,
				});
			} else {
				promiseRejectRef({
					reason: "Some error occurred. Please try again.",
					response: response,
				});
			}
		});
	}).catch((err) => {
		promiseRejectRef({
			reason: "Server error occurred. Please try again.",
			response: err,
		});
	});
	return promise;
};
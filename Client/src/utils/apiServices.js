export const baseUrl = import.meta.env.VITE_BASE_URl || 'http://localhost:4444/api';

export const postRequest = async (url, bodydata) => {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: bodydata,
	});

	const data = await response.json();

	if (!response.ok) {
		let message;

		if (data?.message) {
			message = data.message;
		} else {
			message = data;
		}
		return { error: true, message };
	}

	return data;
};

export const getRequest = async (url) => {
	const response = await fetch(url);
	const data = await response.json();

	if (!response.ok) {
		let message = 'An error have occured...';
		if (data?.message) {
			message = data.message;
		}

		return { error: true, message };
	}

	return data;
};
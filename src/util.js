import axios from "axios";
import Cookie from "universal-cookie";

const cookie = new Cookie();

// Get CSRF token
export function getToken() {
	let cookieValue = null;
	const name = "csrftoken";

	if (document.cookie && document.cookie !== "") {
		const cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.substring(0, name.length + 1) === name + "=") {
				cookieValue = decodeURIComponent(
					cookie.substring(name.length + 1)
				);
				break;
			}
		}
	}
	return cookieValue;
}

// Get username of user
export async function getUsername() {
	try {
		// Get username from cookie if it's there
		const existingUsername = cookie.get("username");
		if (existingUsername) {
			return existingUsername;
		}

		// Make API call and set cookie and redux state
		const response = await axios.get("/api/auth/user", {
			withCredentials: true,
		});
		const username = response.data.username;
		cookie.set("username", username, { path: "/" });

		return username;
	} catch (err) {
		return null;
	}
}

export async function getEmail() {
	try {
		// Get username from cookie if it's there
		const existingEmail = cookie.get("email");
		if (existingEmail) {
			return existingEmail;
		}

		// Make API call and set cookie and redux state
		const response = await axios.get("/api/auth/email", {
			withCredentials: true,
		});
		cookie.set("email", response.data, { path: "/" });

		return response.data;
	} catch (err) {
		alert(
			"There was an error determining your email. Please check that you are connected to a network."
		);

		return null;
	}
}

// Sort songs by order of creation (e.g. id)
export function sortSongsById(list) {
	list.sort((a, b) => a.id < b.id);
}

// Update song to database (since updating a song to redux isn't pushed to the database unless it's saved)
export function updateSongToDatabase(item) {
	axios.put(`/api/songs/${item.id}/`, item, {
		withCredentials: true,
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getToken(),
		},
	});
}

export function updateSongAttributeToDatabase(id, type, value) {
	axios.patch(
		`/api/songs/${id}/`,
		{
			[type]: value,
		},
		{
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": getToken(),
			},
		}
	);
}

// Get the size of a list
function sz(obj) {
	return Object.keys(obj).length;
}

// Compare song lists by value to detect if changes have been made
export function compareSongsByValue(song1, song2) {
	if (!song1 || !song2) {
		return true;
	}
	if (sz(song1) !== sz(song2)) {
		return false;
	}
	for (const item in song1) {
		// These values are automatically updated to the database
		if (item === "name" || item === "artist" || item === "views" || item === "chords") {
			continue;
		}
		if (song1[item] !== song2[item]) {
			return false;
		}
	}
	return true;
}

// Return whether the user has activated their email
export async function getActivationStatus(ignoreCookie = false) {
	if (!ignoreCookie && cookie.get("activated")) {
		return cookie.get("activated") === "true";
	}

	try {
		const response = await axios.get("/api/auth/user", {
			withCredentials: true,
		});
		const is_authenticated = response.data.is_authenticated === "True";
		cookie.set("activated", is_authenticated, { path: "/" });

		return is_authenticated;
	} catch (err) {
		throw err;
	}
}

// Increment view count for a particular song
export async function incrementViewCount(id) {
	try {
		await axios.post(
			"/api/views/increment",
			{
				songId: id,
			},
			{
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": getToken(),
				},
			}
		);
	} catch (err) {
		throw err;
	}
}

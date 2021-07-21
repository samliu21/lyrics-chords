export const SET_USERNAME = "SET_USERNAME";
export const SET_ADMIN = "SET_ADMIN";

export function setUsername(username) {
	return {
		type: SET_USERNAME,
		username: username,
	}
}

export function setAdmin(admin) {
	const val = admin === null ? null : (admin === true || admin === "True");
	return {
		type: SET_ADMIN,
		admin: val,
	}
}
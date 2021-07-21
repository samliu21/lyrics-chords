import { SET_ADMIN, SET_USERNAME } from "../actions/authActions";

const initialStore = {
	username: null,
	admin: null,
};

export default function reducer(state = initialStore, action) {
	switch (action.type) {
		case SET_USERNAME:
			return {
				...state,
				username: action.username,
			}
		case SET_ADMIN:
			return {
				...state,
				admin: action.admin,
			}
		default:
			return state;
	}
}

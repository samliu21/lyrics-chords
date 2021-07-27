import { GET_COMMENTS } from "../actions/commentActions";

const initialStore = {
	comments: null,
};

export default function reducer (store = initialStore, action) {
	switch (action.type) {
		case GET_COMMENTS:
			if (!store.comments) {
				const comments = action.comments;
			}
		default:
			return store;
	}
}
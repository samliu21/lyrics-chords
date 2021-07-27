import { GET_COMMENTS } from "../actions/commentActions";

const initialStore = {
	comments: null,
};

export default function reducer(store = initialStore, action) {
	switch (action.type) {
		case GET_COMMENTS:
			const songId = action.songId;
			if (!store.comments) {
				return {
					...store,
					comments: {
						[songId]: action.comments,
					},
				};
			} else {
				if (!songId) {
					// Is not part of store
					return {
						...store,
						comments: {
							...store.comments,
							[songId]: action.comments,
						},
					};
				} else {
					return {
						...store,
						comments: {
							...store.comments,
							[songId]: [
								...store.comments.songId,
								...action.comments,
							],
						},
					};
				}
			}
		default:
			return store;
	}
}

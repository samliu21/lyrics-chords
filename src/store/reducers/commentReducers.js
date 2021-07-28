import { ADD_COMMENTS, DELETE_COMMENT } from "../actions/commentActions";

const initialStore = {
	comments: null,
};

export default function reducer(store = initialStore, action) {
	switch (action.type) {
		case ADD_COMMENTS:
			const songId = action.songId;
			if (!store.comments) {
				return {
					...store,
					comments: {
						[songId]: action.comments,
					},
				};
			} else {
				if (!store.comments[songId]) {
					// Is not part of store
					return {
						...store,
						comments: {
							...store.comments,
							[songId]: action.comments,
						},
					};
				} else {
					// console.log("Hey there!");
					// console.log(store.comments.songId);
					return {
						...store,
						comments: {
							...store.comments,
							[songId]: [
								...store.comments[songId],
								...action.comments,
							],
						},
					};
				}
			}
		case DELETE_COMMENT:
			return {
				...store,
				comments: {
					...store.comments,
					[action.songId]: store.comments[action.songId].filter(
						(comment) => comment.id !== action.id
					),
				},
			};
		default:
			return store;
	}
}

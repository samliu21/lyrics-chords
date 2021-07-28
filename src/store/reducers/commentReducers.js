import {
	ADD_COMMENTS,
	DELETE_COMMENT,
	EDIT_COMMENT,
} from "../actions/commentActions";

const initialStore = {
	comments: null,
};

const nestComments = (commentList) => {
	const commentMap = {};

	commentList.forEach(comment => commentMap[comment.id] = comment);

	commentList.forEach(comment => {
		if (comment.parent !== null) {
			const parent = commentMap[comment.parent];
			(parent.children = parent.children || []).push(comment);
		}
	}); // Each comment will be placed in the children block of its parent
	const filtered = commentList.filter(comment => { // Only parentless comments are left at top
		return comment.parent === null;
	});
	return filtered;
}

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
		case EDIT_COMMENT:
			const current = store.comments[action.songId].find(
				(comment) => comment.id === action.id
			);
			current.contents = action.contents;
			current.date_of_creation = action.time;
			current.edited = true;
			const list = store.comments[action.songId].filter(
				(comment) => comment.id !== action.id
			);
			list.push(current);
			return {
				...store,
				comments: {
					...store.comments,
					[action.songId]: list,
				},
			};
		default:
			return store;
	}
}

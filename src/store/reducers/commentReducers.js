import {
	ADD_COMMENTS,
	DELETE_COMMENT,
	EDIT_COMMENT,
} from "../actions/commentActions";

const initialStore = {
	comments: null,
	flatComments: null,
};

// Turns flat structure into tree with children property that can be recursively traversed
// Deep copies the original flatList
const nestComments = (commentListOriginal) => {
	const commentMap = {};
	const commentList = [];
	for (const comment of commentListOriginal) {
		commentList.push({ ...comment });
	}

	commentList.forEach((comment) => (commentMap[comment.id] = comment));

	commentList.forEach((comment) => {
		if (comment.parent !== null) {
			const parent = commentMap[comment.parent];
			(parent.children = parent.children || []).push(comment);
		}
	}); // Each comment will be placed in the children block of its parent
	const filtered = commentList.filter((comment) => {
		// Only parentless comments are left at top
		return comment.parent === null;
	});
	return filtered;
};

// Delete comment and all its children
// Look for all comments with parent rootId, add those ids to the queue, and repeat
// Filter function leaves original array untouched
const deleteHelper = (flatList, rootId) => {
	const q = [rootId];
	const toRemove = [rootId];
	while (q.length) {
		const id = q.pop();
		for (const comment of flatList) {
			if (comment.parent === id) {
				q.push(comment.id);
				toRemove.push(comment.id);
			}
		}
	}
	return flatList.filter((comment) => toRemove.indexOf(comment.id) === -1);
};

export default function reducer(store = initialStore, action) {
	const songId = action.songId;
	switch (action.type) {
		case ADD_COMMENTS:
			if (!store.flatComments) {
				// Store is uninitialized
				return {
					flatComments: {
						[songId]: action.comments,
					},
					comments: {
						[songId]: nestComments(action.comments),
					},
				};
			} else {
				if (!store.flatComments[songId]) {
					// Store is initialized, but no comments yet for songId
					// Is not part of store
					return {
						...store,
						flatComments: {
							...store.flatComments,
							[songId]: action.comments,
						},
						comments: {
							...store.comments,
							[songId]: nestComments(action.comments),
						},
					};
				} else {
					const flatComments = {
						...store.flatComments,
						[songId]: [
							...store.flatComments[songId],
							...action.comments,
						],
					};

					const comments = {
						...store.comments,
						[songId]: nestComments(flatComments[songId]),
					};
					return {
						...store,
						flatComments: flatComments,
						comments: comments,
					};
				}
			}
		case DELETE_COMMENT:
			const filteredFlatComments = {
				...store.flatComments,
				[songId]: deleteHelper(store.flatComments[songId], action.id),
			};

			const filteredComments = {
				...store.comments,
				[songId]: nestComments(filteredFlatComments[songId]),
			};

			return {
				...store,
				flatComments: filteredFlatComments,
				comments: filteredComments,
			};
		case EDIT_COMMENT:
			const current = store.flatComments[songId].find(
				(comment) => comment.id === action.id
			);
			const newComment = { // Get new comment with edited contents
				...current,
				contents: action.contents,
				date_of_creation: action.time,
				edited: true,
			};

			// Filter original list and add new comment
			const list = store.flatComments[songId].filter(
				(comment) => comment.id !== action.id
			);
			list.push(newComment);
			const newFlatComments = {
				...store.flatComments,
				[songId]: list,
			};
			const newComments = {
				...store.comments,
				[songId]: nestComments(list),
			};

			return {
				...store,
				flatComments: newFlatComments,
				comments: newComments,
			};
		default:
			return store;
	}
}

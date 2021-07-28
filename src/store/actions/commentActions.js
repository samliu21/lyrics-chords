import axios from "axios";

import { getToken } from "../../util";

export const ADD_COMMENTS = "GET_COMMENTS";
export const DELETE_COMMENT = "DELETE_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";

export const getComments = (id) => {
	return async (dispatch) => {
		try {
			const response = await axios.get(
				`/api/comments/${id}/get_song_comments/`
			);

			const comments = response.data;

			dispatch({
				type: ADD_COMMENTS,
				songId: id,
				comments: comments,
			});
		} catch (err) {
			console.log(err.message);
		}
	};
};

export const addComment = (songId, username, contents, parent) => {
	return async (dispatch) => {
		try {
			const response = await axios.post(
				"/api/comments/",
				{
					songId: songId,
					user: username,
					contents: contents,
					parent: parent,
				},
				{
					withCredentials: true,
					headers: {
						"X-CSRFToken": getToken(),
						"Content-Type": "application/json",
					},
				}
			);

			const comment = response.data;
			dispatch({
				type: ADD_COMMENTS,
				songId: songId,
				comments: [comment],
			});
		} catch (err) {
			alert("There was an error submitting your comment.");
			console.log(err.message);
		}
	};
};

export const deleteComment = (id, songId) => {
	return async (dispatch) => {
		try {
			axios.delete(`/api/comments/${id}/`, {
				withCredentials: true,
				headers: {
					"X-CSRFToken": getToken(),
					"Content-Type": "application/json",
				},
			});

			dispatch({
				type: DELETE_COMMENT,
				songId: songId,
				id: id,
			});
		} catch (err) {
			console.log(err);
			// console.log(err.message);
		}
	};
};

export const editComment = (songId, id, contents) => {
	return async (dispatch) => {
		try {
			console.log("Hello!");
			const response = await axios.patch(
				`/api/comments/${id}/`,
				{
					contents: contents,
				},
				{
					withCredentials: true,
					headers: {
						"X-CSRFToken": getToken(),
						"Content-Type": "application/json",
					},
				}
			);
			const time = response.data.date_of_creation;

			dispatch({
				type: EDIT_COMMENT,
				songId: songId,
				contents: contents,
				time: time,
				id: id,
			});
		} catch (err) {
			console.log(err.message);
		}
	};
};

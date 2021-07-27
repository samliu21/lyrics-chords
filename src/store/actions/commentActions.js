import axios from "axios";

export const GET_COMMENTS = "GET_COMMENTS";

export const getComments = (id) => {
	return async (dispatch) => {
		try {
			const response = await axios.get(
				`/api/comments/${id}/get_song_comments/`
			);

			const comments = response.data;
			if (comments && comments.length === 0) {
				return;
			}
			dispatch({
				type: GET_COMMENTS,
				comments: comments,
			});
		} catch (err) {
			console.log(err.message);
		}
	};
};

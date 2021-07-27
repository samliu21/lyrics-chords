import axios from "axios";
import React, { createRef } from "react";
import { useSelector } from "react-redux";
import { getToken } from "../../util";

import { styles } from "./CommentStyles";

export default function Comments() {
	const username = useSelector((state) => state.auth.username);
	const newCommentRef = createRef();

	const newCommentHandler = async () => {
		const response = await axios.post(
			"/api/comments/",
			{
				user: username,
				contents: newCommentRef.current.value,
			},
			{
				withCredentials: true,
				headers: {
					"X-CSRFToken": getToken(),
					"Content-Type": "application/json",
				},
			}
		);

		console.log(response.data);	
	};

	return (
		username && (
			<div>
				<h2 style={styles.title}>Comments</h2>
				<div style={styles.newComment}>
					<h3>New comment</h3>
					<input style={styles.input} ref={newCommentRef} />
					<button onClick={newCommentHandler}>Post</button>
				</div>
			</div>
		)
	);
}

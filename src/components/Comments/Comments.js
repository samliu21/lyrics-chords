import axios from "axios";
import React, { createRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "../../util";

import * as commentActions from "../../store/actions/commentActions";
import CommentsBlock from "../CommentsBlock/CommentsBlock";
import { styles } from "./CommentStyles";

export default function Comments(props) {
	const username = useSelector((state) => state.auth.username);
	const newCommentRef = createRef();

	const dispatch = useDispatch();

	const { id } = props;

	const comments = useSelector((state) =>
		id && state.comments.comments ? state.comments.comments[id] : null
	);

	useEffect(() => {
		if (id && !comments) {
			dispatch(commentActions.getComments(id));
		}
	}, [dispatch, comments, id]);

	const newCommentHandler = async () => {
		const response = await axios.post(
			"/api/comments/",
			{
				songId: props.id,
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
	};

	if (!comments) {
		return <br />;
	}

	return (
		username && (
			<div>
				<h2 style={styles.title}>Comments</h2>
				{comments.map((comment) => (
					<CommentsBlock
						username={comment.username}
						contents={comment.contents}
						date={comment.date_of_creation}
					/>
				))}
				{/* <div style={styles.newComment}>
					<h3>New comment</h3>
					<input style={styles.input} ref={newCommentRef} />
					<button onClick={newCommentHandler}>Post</button>
				</div> */}
			</div>
		)
	);
}

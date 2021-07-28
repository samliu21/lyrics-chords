import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as commentActions from "../../store/actions/commentActions";
import CommentsBlock from "../CommentsBlock/CommentsBlock";
import LoadingCircle from "../LoadingCircle/LoadingCircle";
import { styles } from "./CommentStyles";

export default function Comments(props) {
	const username = useSelector((state) => state.auth.username);
	const newCommentRef = useRef();
	const [isLoading, setIsLoading] = useState(false);

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
		setIsLoading(true);
		dispatch(
			commentActions.addComment(id, username, newCommentRef.current.value)
		);
		newCommentRef.current.value = "";
		setTimeout(() => setIsLoading(false), 500);
	};

	return (
		comments && (
			<div>
				<h2 style={styles.title}>Comments</h2>
				{comments.map((comment) => (
					<CommentsBlock
						key={comment.id}
						songId={id}
						id={comment.id}
						commentUsername={comment.username}
						contents={comment.contents}
						date={comment.date_of_creation}
					/>
				))}
				{username && (
					<div style={styles.newComment}>
						<h3 style={styles.heading}>New comment</h3>
						<hr />
						<textarea
							rows={4}
							style={styles.input}
							maxLength={500}
							ref={newCommentRef}
						/>
						<hr />
						<button
							onClick={newCommentHandler}
							style={styles.button}
						>
							Submit
						</button>
					</div>
				)}
				{isLoading && <LoadingCircle />}
			</div>
		)
	);
}

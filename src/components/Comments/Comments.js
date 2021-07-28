import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as commentActions from "../../store/actions/commentActions";
import CommentsBlock from "../CommentsBlock/CommentsBlock";
import LoadingCircle from "../LoadingCircle/LoadingCircle";
import NewComment from "../NewComment/NewComment";
import TextArea from "../TextArea/TextArea";
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
			commentActions.addComment(
				id,
				username,
				newCommentRef.current.value,
				null
			)
		);
		newCommentRef.current.value = "";
		setTimeout(() => setIsLoading(false), 500);
	};

	return (
		comments && (
			<div>
				<h2 style={styles.title}>Comments</h2>
				{comments.map((comment) => (
					<div>
						<CommentsBlock
							key={comment.id}
							songId={id}
							commentUsername={comment.username}
							comment={comment}
						/>
					</div>
				))}
				{username && (
					<NewComment
						title="New comment"
						refName={newCommentRef}
						submitHandler={newCommentHandler}
						border
					/>
				)}
				{isLoading && <LoadingCircle />}
			</div>
		)
	);
}

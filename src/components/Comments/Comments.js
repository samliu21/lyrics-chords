import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as commentActions from "../../store/actions/commentActions";
import CommentsBlock from "../CommentsBlock/CommentsBlock";
import LoadingCircle from "../LoadingCircle/LoadingCircle";
import NewComment from "../NewComment/NewComment";
import ui from "../../styles/ui.module.css";

export default function Comments(props) {
	const username = useSelector((state) => state.auth.username);
	const newCommentRef = useRef();
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();

	const { id } = props;

	const comments = useSelector((state) =>
		id && state.comments.comments && state.comments.comments[id]
			? state.comments.comments[id]
			: null
	);

	useEffect(() => {
		if (id && !comments) {
			dispatch(commentActions.getComments(id));
		}
	}, [dispatch, comments, id]);

	const newCommentHandler = async () => {
		const value = newCommentRef.current.value;
		if (value === "") {
			console.log("Comment cannot be empty!");
			return;
		}

		setIsLoading(true);
		dispatch(
			commentActions.addComment(
				id,
				username,
				value,
				null
			)
		);
		newCommentRef.current.value = "";
		setTimeout(() => setIsLoading(false), 500);
	};

	return (
		comments && (
			<div>
				<h2 className={ui["song-subtitle"]}>Comments</h2>
				{comments.length === 0 ? (
					<p>No comments.</p>
				) : (
					comments.map((comment) => (
						<CommentsBlock
							key={comment.id}
							songId={id}
							commentUsername={comment.username}
							comment={comment}
						/>
					))
				)}
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

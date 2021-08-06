import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as commentActions from "../../store/actions/commentActions";
import { BiTrash, BiPencil } from "react-icons/bi";
import { BsArrow90DegLeft } from "react-icons/bs";
import NewComment from "../NewComment/NewComment";
import styles from "./CommentsBlock.module.css";
import layout from "../../styles/layout.module.css";
import ui from "../../styles/ui.module.css";

export default function CommentsBlock(props) {
	const username = useSelector((state) => state.auth.username);
	const [editMode, setEditMode] = useState(false);
	const [replying, setReplying] = useState(false);
	const editableRef = useRef();
	const replyRef = useRef();

	const { songId, commentUsername } = props;
	const { contents, date_of_creation, id, edited, children } = props.comment;

	const dispatch = useDispatch();

	const dateConverter = () => {
		const dateOfCreation = new Date(date_of_creation);
		const currentDate = new Date();
		const msDif = currentDate - dateOfCreation; // Time elapsed in milliseconds

		if (dateOfCreation.getDate() === currentDate.getDate()) {
			// Same day
			const hourDif = msDif / 3600000;
			if (hourDif < 1) {
				// Show minutes ago
				const minuteDif = Math.round(hourDif * 60);
				if (minuteDif === 0) {
					return "now";
				}
				return minuteDif === 1
					? "1 minute ago"
					: `${minuteDif} minutes ago`;
			} else {
				// Show hours ago
				return Math.round(hourDif) === 1
					? "1 minute ago"
					: `${Math.round(hourDif)} hours ago`;
			}
		}

		const dayDif = Math.round(msDif / 3600000 / 24);
		if (dayDif <= 30) {
			return dayDif === 1 ? "1 day ago" : `${dayDif} days ago`;
		}

		const monthDif = Math.round(dayDif / 30);
		if (monthDif <= 12) {
			return monthDif === 1 ? "1 month ago" : `${monthDif} months ago`;
		} else {
			return `on ${dateOfCreation.getFullYear()}/${dateOfCreation.getMonth()}/${
				dateOfCreation.getDate
			}`;
		}
	};

	const editHandler = () => {
		setEditMode(true);
	};

	const deleteHandler = () => {
		dispatch(commentActions.deleteComment(id, songId));
	};

	const editCancelHandler = () => {
		setEditMode(false);
	};

	const editSubmitHandler = () => {
		const val = editableRef.current.value;
		if (val === "") {
			alert("Comment cannot be empty.");
			return;
		}
		if (contents !== val) {
			dispatch(commentActions.editComment(songId, id, val));
		}
		setEditMode(false);
	};

	const replyHandler = () => {
		setReplying(true);
	};

	const replyCancelHandler = () => {
		setReplying(false);
	};

	const replySubmitHandler = () => {
		dispatch(
			commentActions.addComment(
				songId,
				username,
				replyRef.current.value,
				id
			)
		);
		setReplying(false);
	};

	const nestedComments = (children || []).map((comment) => (
		<CommentsBlock
			key={comment.id}
			songId={songId}
			commentUsername={comment.username}
			comment={comment}
		/>
	));

	return (
		<div className={styles["outer-container"]} key={id}>
			<div className={styles.container}>
				<div className={styles["horizontal-container"]}>
					<div className={`${layout["horizontal-center"]} ${ui["plain-h4"]} ${styles.grow}`}>
						<div className={`${ui.emphasis}`}>
							{commentUsername}
						</div>
						<div className={styles.grow}>
							&nbsp; {edited ? "edited" : "commented"}&nbsp;
							{dateConverter()}
						</div>
					</div>
					<div className={layout["horizontal-center"]}>
						{username === commentUsername && (
							<BiPencil
								onClick={editHandler}
								className={`${ui.pointer}`}
							/>
						)}
						{username === commentUsername && (
							<BiTrash
								onClick={deleteHandler}
								className={`${ui.pointer} ${styles.trash}`}
							/>
						)}
						{username && (
							<BsArrow90DegLeft
								onClick={replyHandler}
								className={`${ui.pointer}`}
							/>
						)}
					</div>
				</div>
				{editMode ? (
					<NewComment
						refName={editableRef}
						submitHandler={editSubmitHandler}
						cancelHandler={editCancelHandler}
						defaultValue={contents}
					/>
				) : (
					<div className={ui["plain-h4"]}>
						<hr />
						{contents}
					</div>
				)}
			</div>
			<div className={styles.children}>{nestedComments}</div>
			{replying && (
				<div className={styles["reply-container"]}>
					<NewComment
						title="Replying"
						refName={replyRef}
						cancelHandler={replyCancelHandler}
						submitHandler={replySubmitHandler}
						border
					/>
				</div>
			)}
		</div>
	);
}

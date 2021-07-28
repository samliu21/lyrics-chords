import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as commentActions from "../../store/actions/commentActions";
import { BiTrash, BiPencil } from "react-icons/bi";
import { BsArrow90DegLeft } from "react-icons/bs";
import NewComment from "../NewComment/NewComment";
import { styles } from "./CommentsBlockStyles";
import TextArea from "../TextArea/TextArea";

export default function CommentsBlock(props) {
	const username = useSelector((state) => state.auth.username);
	const [editMode, setEditMode] = useState(false);
	const [replying, setReplying] = useState(false);
	const editableRef = useRef();
	const replyRef = useRef();

	const { commentUsername, contents, date, id, songId, edited } = props;

	const dispatch = useDispatch();

	const dateConverter = () => {
		const dateOfCreation = new Date(date);
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
		
	}

	return (
		<div style={styles.outerContainer}>
			<div style={styles.container}>
				<div style={styles.horizontalContainer}>
					<div className="horizontal-default">
						<div style={styles.username}>{commentUsername}</div>
						<div>
							&nbsp; {edited ? "edited" : "commented"}&nbsp;
							{dateConverter()}
						</div>
					</div>
					<div className="horizontal-default">
						{username === commentUsername && (
							<BiPencil
								onClick={editHandler}
								className="pointer"
							/>
						)}
						<BiTrash
							onClick={deleteHandler}
							style={styles.trash}
							className="pointer"
						/>
						{username && (
							<BsArrow90DegLeft
								onClick={replyHandler}
								className="pointer"
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
					<div style={styles.contents}>
						<hr />
						{contents}
					</div>
				)}
			</div>
			{replying && (
				<div style={styles.replyContainer}>
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

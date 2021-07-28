import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as commentActions from "../../store/actions/commentActions";
import { BiTrash, BiPencil } from "react-icons/bi";
import { styles } from "./CommentsBlockStyles";

export default function CommentsBlock(props) {
	const username = useSelector((state) => state.auth.username);
	const [editMode, setEditMode] = useState(false);
	const editableRef = useRef();

	const { commentUsername, contents, date, id, songId } = props;

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

	return (
		<div style={styles.container}>
			<div style={styles.horizontalContainer}>
				<div className="horizontal-default">
					<div style={styles.username}>{commentUsername}</div>
					<div>&nbsp; commented {dateConverter()}</div>
				</div>
				<div className="horizontal-default">
					{username === commentUsername && (
						<BiPencil onClick={editHandler} className="pointer" />
					)}
					<BiTrash onClick={deleteHandler} className="pointer" />
				</div>
			</div>
			<hr />
			{editMode ? (
				<div>
					<textarea
						rows={4}
						defaultValue={contents}
						ref={editableRef}
						style={styles.input}
					/>
					<hr />
					<div className="horizontal-between">
						<button
							onClick={editCancelHandler}
							style={styles.button}
						>
							Cancel
						</button>
						<button
							onClick={editSubmitHandler}
							style={styles.button}
						>
							Submit
						</button>
					</div>
				</div>
			) : (
				<div style={styles.contents}>{contents}</div>
			)}
		</div>
	);
}

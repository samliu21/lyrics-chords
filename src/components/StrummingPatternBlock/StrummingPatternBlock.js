import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as songsActions from "../../store/actions/songsActions";

import { styles } from "./StrummingPatternBlockStyles";

export default function StrummingPatternBlock(props) {
	const selectedSong = props.selectedSong;

	const dispatch = useDispatch();

	// On strumming pattern blur, push strumming pattern to backend
	const strummingPatternBlurHandler = (e) => {
		dispatch(
			songsActions.updateSong(
				selectedSong.id,
				"strumming_pattern",
				e.target.value
			)
		);
	};

	// On strumming pattern key down, prevent default enter
	const keyDownHandler = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			event.target.blur();
		}

		props.setUnsavedChanges(true);
	};

	return (
		<div>
			<h2 style={styles.subheading}>Strumming Pattern</h2>
			{props.editable ? (
				<input
					style={styles.input}
					className="preventEnter"
					defaultValue={selectedSong.strumming_pattern}
					onKeyDown={keyDownHandler}
					onBlur={strummingPatternBlurHandler}
					autoCorrect="off"
				/>
			) : (
				<p style={styles.input}>
					{!selectedSong.strumming_pattern
						? " "
						: selectedSong.strumming_pattern}
				</p>
			)}
		</div>
	);
}

import React from "react";

import { styles } from "./StrummingPatternBlockStyles";

export default function StrummingPatternBlock(props) {
	const selectedSong = props.selectedSong;

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
					id="strumming_pattern"
					style={styles.input}
					defaultValue={selectedSong.strumming_pattern}
					onKeyDown={keyDownHandler}
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

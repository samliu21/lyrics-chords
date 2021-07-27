import React from "react";
import LoadingCircle from "../LoadingCircle/LoadingCircle";

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

	if (!props.strummingPatternRef) {
		return <LoadingCircle />;
	}

	return (
		<div>
			<h2 style={styles.subheading}>Strumming Pattern</h2>
			<input
				ref={props.strummingPatternRef}
				style={styles.input}
				defaultValue={selectedSong.strumming_pattern}
				onKeyDown={keyDownHandler}
				autoCorrect="off"
				readOnly={!props.editable}
			/>
		</div>
	);
}

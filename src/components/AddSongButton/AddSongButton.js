import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../store/actions/songsActions";

import { styles } from "./AddSongButtonStyles";
import { getUsername } from "../../util";
import LoadingCircle from "../LoadingCircle/LoadingCircle";

export default function AddSongButton() {
	const [isAdding, setIsAdding] = useState(false);

	const dispatch = useDispatch();

	// Add new song to backend
	function addSongHandler() {
		setIsAdding(true);

		getUsername()
			.then((username) => {
				localStorage.removeItem(username);

				dispatch(actions.addSong(username));
			})
			.finally(() => {
				setTimeout(() => setIsAdding(false), 500);
			});
	}

	return (
		<div>
			{isAdding && <LoadingCircle />}
			<span
				className="important"
				style={styles.addSong}
				onClick={addSongHandler}
			>
				ADD SONG
			</span>
		</div>
	);
}

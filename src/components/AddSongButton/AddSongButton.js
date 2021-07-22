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
	async function addSongHandler() {
		setIsAdding(true);

		const username = await getUsername();
		localStorage.removeItem(username);

		dispatch(actions.addSong(username));
		setTimeout(() => setIsAdding(false), 500);
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

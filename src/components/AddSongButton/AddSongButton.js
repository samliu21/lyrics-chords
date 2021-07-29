import React, { useState } from "react";
import { useDispatch } from "react-redux";

import * as actions from "../../store/actions/songsActions";
import CapitalText from "../CapitalText/CapitalText";
import { getUsername } from "../../util";
import LoadingCircle from "../LoadingCircle/LoadingCircle";

export default function AddSongButton() {
	const [isAdding, setIsAdding] = useState(false);

	const dispatch = useDispatch();

	// Dispatch new song to backend
	async function addSongHandler() {
		setIsAdding(true);

		const username = await getUsername();
		dispatch(actions.addSong(username));

		setTimeout(() => setIsAdding(false), 500);
	}

	return (
		<div>
			{isAdding && <LoadingCircle />}
			<CapitalText onClick={addSongHandler}>Add Song</CapitalText>
		</div>
	);
}

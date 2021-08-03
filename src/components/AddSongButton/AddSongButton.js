import React, { useState } from "react";
import { useDispatch } from "react-redux";

import * as actions from "../../store/actions/songsActions";
import CapitalText from "../CapitalText/CapitalText";
import LoadingCircle from "../LoadingCircle/LoadingCircle";

export default function AddSongButton() {
	const [isAdding, setIsAdding] = useState(false);

	const dispatch = useDispatch();

	// Dispatch new song to backend
	async function addSongHandler() {
		setIsAdding(true);

		dispatch(actions.addSong());

		setTimeout(() => setIsAdding(false), 500);
	}

	return (
		<div>
			{isAdding && <LoadingCircle />}
			<CapitalText onClick={addSongHandler}>Add Song</CapitalText>
		</div>
	);
}

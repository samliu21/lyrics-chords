import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import * as songsActions from "../../store/actions/songsActions";
import { styles } from "./InfoBarStyles";
import LoadingCircle from "../LoadingCircle/LoadingCircle";

export default function InfoBar(props) {
	const username = useSelector((state) => state.auth.username);
	const songList = useSelector((state) => state.songs.userSongs);
	const [isLoading, setIsLoading] = useState(false);

	const size = useRef(songList ? songList.length : null);

	const history = useHistory();

	if (songList && songList.length !== size.current) {
		size.current = songList.length;

		const sortedList = [...songList].sort((a, b) => a.id < b.id);
		const obj = sortedList[0];
		setIsLoading(false);
		history.push(`/songs/${obj.creator}/${obj.id}`);
	}

	const dispatch = useDispatch();

	const copyHandler = () => {
		setIsLoading(true);
		dispatch(songsActions.copySong(props.selectedSong, username));
	};

	return (
		<div>
			<p style={styles.text}>
				{props.selectedSong.creator}
				&nbsp;&nbsp;&nbsp;|
				{username && (
					<span onClick={copyHandler} style={styles.copy}>
						&nbsp;&nbsp;&nbsp;COPY THIS SONG
					</span>
				)}
			</p>
			{isLoading && <LoadingCircle />}
		</div>
	);
}

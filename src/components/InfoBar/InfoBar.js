import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import * as songsActions from "../../store/actions/songsActions";
import LoadingCircle from "../LoadingCircle/LoadingCircle";
import design from "../../styles/ui.module.css";
import styles from "./InfoBar.module.css";

export default function InfoBar(props) {
	const username = useSelector((state) => state.auth.username);
	const songList = useSelector((state) => state.songs.userSongs);
	const [isLoading, setIsLoading] = useState(false);

	const size = useRef(songList ? songList.length : null);

	const history = useHistory();

	useEffect(() => {
		if (songList && songList.length !== size.current) {
			size.current = songList.length;

			const sortedList = [...songList].sort((a, b) => a.id < b.id);
			const obj = sortedList[0];
			setIsLoading(false);

			if (obj) {
				history.push(`/songs/${obj.creator}/${obj.id}`);
			}
		}
	}, [songList, history]);

	const dispatch = useDispatch();

	const copyHandler = () => {
		setIsLoading(true);
		dispatch(songsActions.copySong(props.selectedSong));
	};

	if (!props.selectedSong) {
		return <p></p>;
	}

	return (
		<div>
			<p className={styles.text}>
				{props.selectedSong.creator}
				&nbsp;&nbsp;&nbsp;|
				{username && (
					<span onClick={copyHandler} className={design.pointer}>
						&nbsp;&nbsp;&nbsp;COPY THIS SONG
					</span>
				)}
			</p>
			{isLoading && <LoadingCircle />}
		</div>
	);
}

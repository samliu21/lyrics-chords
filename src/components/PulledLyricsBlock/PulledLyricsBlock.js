import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { styles } from "./PulledLyricsBlockStyles";
import * as songsActions from "../../store/actions/songsActions";

export default function PulledLyricsBlock(props) {
	const selectedSong = useSelector((state) =>
		state.songs.userSongs.find((song) => {
			return song.id === props.songId;
		})
	);

	const dispatch = useDispatch();

	// On pulled lyrics blur, push pulled lyrics to backend
	const pulledLyricsBlurHandler = (e) => {
		props.setUnsavedChanges(true);

		dispatch(
			songsActions.updateSong(
				selectedSong.id,
				"pulled_lyrics",
				e.target.innerText
			)
		);
	};

	return (
		<div>
			<h2 style={styles.subheading}>Pulled Lyrics</h2>
			<p
				style={styles.input}
				contentEditable={true}
				suppressContentEditableWarning={true}
				onBlur={pulledLyricsBlurHandler}
				spellCheck={false}
			>
				{selectedSong.pulled_lyrics
					? selectedSong.pulled_lyrics
					: "Get started by typing the name and artist of a song above. Then, press Options --> Fetch Lyrics to scrape the web for the lyrics of your song or copy paste the lyrics here. When you're satisfied, press Options --> Transfer Lyrics to start annotating the lyrics with chords in the Lyrics section. Once you've annotated, press auto scroll in the top right corner to start playing through!\n\nClick the help section in the top navigation bar to learn more!"}
			</p>
		</div>
	);
}

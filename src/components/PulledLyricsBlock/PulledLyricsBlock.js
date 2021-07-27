import React from "react";
import { useDispatch } from "react-redux";
import * as songsActions from "../../store/actions/songsActions";
import LoadingCircle from "../LoadingCircle/LoadingCircle";

import { styles } from "./PulledLyricsBlockStyles";

export default function PulledLyricsBlock(props) {
	const selectedSong = props.selectedSong;

	const dispatch = useDispatch();

	const keyDownHandler = () => {
		props.setUnsavedChanges(true);
	};

	// If the user manually types in the lyrics, the transfer will occur on the redux state, and the typed in lyrics haven't been updated to redux yet
	// We need to dispatch on blur
	const blurHandler = (e) => {
		if (e.target.innerText === selectedSong.pulled_lyrics) {
			return;
		}
		dispatch(
			songsActions.updateSong(
				selectedSong.id,
				"pulled_lyrics",
				e.target.innerText
			)
		);
	};

	if (!props.pulledLyricsRef) {
		return <LoadingCircle />;
	}

	return (
		<div>
			<h2 style={styles.subheading}>Pulled Lyrics</h2>
			<p
				ref={props.pulledLyricsRef}
				style={styles.input}
				contentEditable={true}
				suppressContentEditableWarning={true}
				onKeyDown={keyDownHandler}
				onBlur={blurHandler}
				spellCheck={false}
			>
				{selectedSong.pulled_lyrics
					? selectedSong.pulled_lyrics
					: "Get started by typing the name and artist of a song above. Then, press Options --> Fetch Lyrics to scrape the web for the lyrics of your song or copy paste the lyrics here. When you're satisfied, press Options --> Transfer Lyrics to start annotating the lyrics with chords in the Lyrics section. Once you've annotated, press auto scroll in the top right corner to start playing through!\n\nClick the help section in the top navigation bar to learn more!\n\nTo get an idea of how this works, press Transfer Lyrics with the current text!"}
			</p>
		</div>
	);
}

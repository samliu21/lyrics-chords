import React from "react";

import { styles } from "./PulledLyricsBlockStyles";

export default function PulledLyricsBlock(props) {
	const selectedSong = props.selectedSong;

	const keyDownHandler = () => {
		props.setUnsavedChanges(true);
	}

	return (
		<div>
			<h2 style={styles.subheading}>Pulled Lyrics</h2>
			<p
				id="pulled_lyrics"
				style={styles.input}
				contentEditable={true}
				suppressContentEditableWarning={true}
				onKeyDown={keyDownHandler}
				spellCheck={false}
			>
				{selectedSong.pulled_lyrics
					? selectedSong.pulled_lyrics
					: "Get started by typing the name and artist of a song above. Then, press Options --> Fetch Lyrics to scrape the web for the lyrics of your song or copy paste the lyrics here. When you're satisfied, press Options --> Transfer Lyrics to start annotating the lyrics with chords in the Lyrics section. Once you've annotated, press auto scroll in the top right corner to start playing through!\n\nClick the help section in the top navigation bar to learn more!"}
			</p>
		</div>
	);
}

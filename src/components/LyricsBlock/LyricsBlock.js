import React from "react";
import { useSelector } from "react-redux";

import { styles } from "./LyricsBlockStyles";

export default function LyricsBlock(props) {
	const splitChords = useSelector((store) => store.selectedSong.splitChords);

	const selectedSong = props.selectedSong;

	// Enter causes blur for both chords and lyrics
	const preventEnterHandler = (event) => {
		props.setUnsavedChanges(true);

		if (event.key === "Enter") {
			event.preventDefault();
			event.target.blur();
		} else if (event.key === ".") {
			event.preventDefault();
			event.target.value += "    ";
		} else if (event.key === ",") {
			event.preventDefault();
			const val = event.target.value;
			event.target.value =
				val.length <= 4 ? "" : val.substr(0, val.length - 4);
		}
	};

	// If lyric line is turned to "", it will be rendered as two blank lines
	// Change to " "
	const lyricsBlurHandler = (e) => {
		if (e.target.innerText === "") {
			e.target.innerText = " ";
		}
		console.log(e.target.innerText === " ");
	};

	// Takes in string lyrics and turns each into a string and input div
	const renderItems = () => {
		return selectedSong.lyrics.split("\n").map((item, idx) => {
			let content = (
				<div key={idx}>
					<input
						id={`c${idx}`}
						style={styles.input}
						defaultValue={
							selectedSong.chords.split("\n")[idx] ?? ""
						}
						onKeyDown={preventEnterHandler}
						autoCorrect="off"
					/>
					<p
						id={`l${idx}`}
						style={styles.lyricLine}
						contentEditable={true}
						suppressContentEditableWarning={true}
						onKeyDown={preventEnterHandler}
						onBlur={lyricsBlurHandler}
						spellCheck={false}
					>
						{item}
					</p>
				</div>
			);

			if (!props.editable) {
				content = (
					<div key={idx}>
						{/* If value is "", the div will collapse to nothing */}
						<div style={styles.input}>
							{!selectedSong.chords.split("\n")[idx]
								? " "
								: selectedSong.chords.split("\n")[idx]}
						</div>
						<p style={styles.lyricLine}>{item}</p>
					</div>
				);
			}

			return content;
		});
	};

	return (
		<div>
			<h2 style={styles.lyricsTitle}>Lyrics</h2>
			{selectedSong.lyrics === "" ? (
				<p style={styles.lyricLine}>No lyrics found.</p>
			) : (
				renderItems()
			)}
		</div>
	);
}

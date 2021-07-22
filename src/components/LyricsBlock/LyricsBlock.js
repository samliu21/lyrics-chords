import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as selectedSongActions from "../../store/actions/selectedSongActions";
import * as songsActions from "../../store/actions/songsActions";

import { styles } from "./LyricsBlockStyles";

export default function LyricsBlock(props) {
	const splitChords = useSelector((store) => store.selectedSong.splitChords);

	const selectedSong = props.selectedSong;

	const dispatch = useDispatch();

	// On chords blur, set chords
	const chordsBlurHandler = () => {
		props.setUnsavedChanges(true);

		dispatch(
			songsActions.updateSong(
				selectedSong.id,
				"chords",
				splitChords.join("~")
			)
		);
	};

	// On chords change, update split chords with dispatch
	const chordsChangeHandler = (idx, e) => {
		const key = e.nativeEvent.data;

		// Solve for the new value
		let resultingValue;
		const initialValue = e.target.value.split(".")[0];
		if (key === ".") {
			e.preventDefault();
			resultingValue = initialValue + "    ";
		} else if (key === ",") {
			e.preventDefault();
			resultingValue =
				initialValue.length <= 4
					? ""
					: initialValue.substr(0, initialValue.length - 4);
		} else {
			resultingValue = e.target.value;
		}

		// Insert new value into chordsCopy
		let chordsCopy = splitChords.slice();
		chordsCopy[idx] = resultingValue;
		dispatch(selectedSongActions.setSelectedSong(chordsCopy));
	};

	// Enter causes blur for both chords and lyrics
	const preventEnterHandler = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			event.target.blur();
		}
	};

	// On lyrics blur, set lyrics
	const lyricsBlurHandler = (idx, event) => {
		const lyricsCopy = selectedSong.lyrics.split("\n").slice();
		lyricsCopy[idx] = event.target.innerText;

		props.setUnsavedChanges(true);

		dispatch(
			songsActions.updateSong(
				selectedSong.id,
				"lyrics",
				lyricsCopy.join("\n")
			)
		);
	};

	// Takes in string lyrics and turns each into a string and input div
	const renderItems = () => {
		return selectedSong.lyrics.split("\n").map((item, idx) => {
			// At the end of each section, add an extra space
			if (item === "") {
				return (
					<div key={idx}>
						<br />
						<br />
					</div>
				);
			}

			let content = (
				<div key={idx}>
					<input
						style={styles.input}
						onBlur={() => chordsBlurHandler(idx)}
						value={splitChords[idx]}
						onChange={(e) => chordsChangeHandler(idx, e)}
						onKeyDown={preventEnterHandler}
						autoCorrect="off"
					/>
					<p
						className="preventEnter"
						style={styles.lyricLine}
						contentEditable={true}
						suppressContentEditableWarning={true}
						onBlur={(e) => lyricsBlurHandler(idx, e)}
						onKeyDown={preventEnterHandler}
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
							{!splitChords[idx] ? " " : splitChords[idx]}
						</div>
						<p style={styles.lyricLine}>{item}</p>
					</div>
				);
			}

			return content;
		});
	};

	if (!splitChords) {
		return (
			<div className="horizontal-default">
				<p>Retrieving data...</p>
			</div>
		);
	}

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

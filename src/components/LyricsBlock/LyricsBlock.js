import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Colors } from "../../constants/Colors";

import { styles } from "./LyricsBlockStyles";

export default function LyricsBlock(props) {
	const selectedSong = props.selectedSong;
	const [lastClicked, setLastClicked] = useState();
	const [clickedChords, setClickedChords] = useState([]);
	const [paste, setPaste] = useState(false);

	const history = useHistory();

	useEffect(() => {
		const unlisten = history.listen(() => setClickedChords([]));
		// const keyUnlisten =

		return () => unlisten();
	}, [history]);

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
	};

	const addToList = (id) => {
		setClickedChords((state) =>
			state.indexOf(id) === -1
				? [...state, id]
				: state.filter((value) => value !== id)
		);
	};

	const selectHandler = (e) => {
		if (!props.isCopyMode) {
			return;
		}

		const id = +e.target.id.substr(1);

		// While selecting
		if (!paste) {
			if (e.altKey) {
				selectMultipleHandler(id);
			} else {
				addToList(id);
			}

			// if (clickedChords.length > 0) {
			setLastClicked(id);
			// } else {
			// 	setLastClicked(null);
			// }
			return;
		}

		const reset = () => {
			setLastClicked(null);
			setClickedChords([]);
			setPaste(false);
		};

		if (clickedChords.length === 0) {
			reset();
			return;
		}

		// While pasting
		const sortedChords = [...clickedChords].sort((a, b) => a.id - b.id);
		const start = sortedChords[0];
		for (const i of sortedChords) {
			const newId = id + i - start;
			const copyFrom = document.getElementById(`c${i}`).value;
			document.getElementById(`c${newId}`).value = copyFrom;
		}
		reset();
	};

	const selectMultipleHandler = (id) => {
		console.log(id, lastClicked);
		if (lastClicked !== null) {
			if (id > lastClicked) {
				for (let i = lastClicked + 1; i <= id; ++i) {
					addToList(i);
				}
			} else if (lastClicked > id) {
				for (let i = lastClicked - 1; i >= id; --i) {
					addToList(i);
				}
			} else if (lastClicked === id) {
				addToList(id);
			}
		} else {
			addToList(id);
		}
	};

	// Takes in string lyrics and turns each into a string and input div
	const renderItems = () => {
		return selectedSong.lyrics.split("\n").map((item, idx) => {
			let chordStyles = styles.input;
			if (props.isCopyMode) {
				if (idx === lastClicked) {
					chordStyles = {
						...chordStyles,
						backgroundColor: Colors.primary,
					};
				} else if (clickedChords.indexOf(idx) !== -1) {
					chordStyles = {
						...chordStyles,
						backgroundColor: Colors.primaryLight,
					};
				}
			}

			let content = (
				<div key={idx}>
					<input
						id={`c${idx}`}
						style={chordStyles}
						defaultValue={
							selectedSong.chords.split("\n")[idx] ?? ""
						}
						onKeyDown={preventEnterHandler}
						autoCorrect="off"
						onClick={selectHandler}
						readOnly={!props.editable || props.isCopyMode}
					/>
					<p
						id={`l${idx}`}
						style={styles.lyricLine}
						contentEditable={props.editable || props.isCopyMode}
						suppressContentEditableWarning={
							props.editable || props.isCopyMode
						}
						onKeyDown={preventEnterHandler}
						onBlur={lyricsBlurHandler}
						spellCheck={false}
					>
						{item}
					</p>
				</div>
			);

			// if (!props.editable) {
			// 	let chordStyles = styles.input;
			// 	if (idx === lastClicked) {
			// 		chordStyles = {
			// 			...chordStyles,
			// 			backgroundColor: Colors.primary,
			// 		};
			// 	} else if (clickedChords.indexOf(idx) > -1) {
			// 		chordStyles = {
			// 			...chordStyles,
			// 			backgroundColor: Colors.primaryLight,
			// 		};
			// 	}

			// 	content = (
			// 		<div key={idx}>
			// 			{/* If value is "", the div will collapse to nothing */}
			// 			<div
			// 				id={`c${idx}`}
			// 				style={chordStyles}
			// 				onClick={selectHandler}
			// 			>
			// 				{!selectedSong.chords.split("\n")[idx]
			// 					? " "
			// 					: selectedSong.chords.split("\n")[idx]}
			// 			</div>
			// 			<p id={`l${idx}`} style={styles.lyricLine}>
			// 				{item}
			// 			</p>
			// 		</div>
			// 	);
			// }

			return content;
		});
	};

	return (
		<div>
			<h2 style={styles.lyricsTitle}>Lyrics</h2>
			<button onClick={() => setPaste(true)}>Copy</button>
			{selectedSong.lyrics === "" ? (
				<p style={styles.lyricLine}>No lyrics found.</p>
			) : (
				renderItems()
			)}
		</div>
	);
}

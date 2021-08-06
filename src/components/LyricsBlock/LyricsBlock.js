import React, { useState, useEffect, createRef } from "react";
import { useHistory } from "react-router";
import { Colors } from "../../constants/Colors";
import LoadingCircle from "../LoadingCircle/LoadingCircle";

import styles from "./LyricsBlock.module.css";
import ui from "../../styles/ui.module.css";

export default function LyricsBlock(props) {
	const selectedSong = props.selectedSong;
	const [lastClicked, setLastClicked] = useState();
	const [clickedChords, setClickedChords] = useState([]);
	const [pasteMode, setPasteMode] = useState("none");

	const { chordRefs, setChordRefs, lyricRefs, setLyricRefs } = props;

	useEffect(() => {
		const arrLength = selectedSong.lyrics.split("\n").length;

		if (!chordRefs || arrLength !== chordRefs.length) {
			const newRefs = new Array(arrLength).fill().map(() => createRef());
			setChordRefs(newRefs);
		}
	}, [selectedSong, chordRefs, setChordRefs]);

	useEffect(() => {
		const arrLength = selectedSong.lyrics.split("\n").length;

		if (!lyricRefs || arrLength !== lyricRefs.length) {
			const newRefs = new Array(arrLength).fill().map(() => createRef());
			setLyricRefs(newRefs);
		}
	}, [selectedSong, lyricRefs, setLyricRefs]);

	const history = useHistory();

	useEffect(() => {
		const unlisten = history.listen(() => setClickedChords([]));

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

		const id = +e.target.id;

		// While selecting
		if (pasteMode === "none") {
			if (e.altKey) {
				selectMultipleHandler(id);
			} else {
				addToList(id);
			}

			setLastClicked(id);
			return;
		}

		if (clickedChords.length === 0) {
			resetHandler();
			return;
		}

		// While pasting
		const sortedChords = [...clickedChords].sort((a, b) => a - b);
		const start = sortedChords[0];
		const range = sortedChords[sortedChords.length - 1] - start + 1;

		props.setUnsavedChanges(true);

		const chordRefsCopy = chordRefs.map((ref) => ref.current.value);

		if (pasteMode === "paste") {
			for (const i of sortedChords) {
				const newId = id + i - start;
				const copyFrom = chordRefsCopy[i];

				const copyTo = chordRefs[newId];
				if (!copyTo || copyTo.current === undefined) {
					break;
				}
				copyTo.current.value = copyFrom;
			}
		} else {
			let multiple = 0;
			let shouldBreak = false;
			while (true) {
				// Same as above, except we use multiple + range to offset the new sequence
				for (const i of sortedChords) {
					const newId = id + i - start + multiple * range;
					const copyFrom = chordRefsCopy[i];

					const copyTo = chordRefs[newId];
					if (!copyTo || copyTo.current === undefined) {
						shouldBreak = true;
						break;
					}

					copyTo.current.value = copyFrom;
				}
				if (shouldBreak) {
					break;
				}
				++multiple;
			}
		}
		resetHandler();
	};

	const selectMultipleHandler = (id) => {
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

	const resetHandler = () => {
		setClickedChords([]);
		setLastClicked(null);
		setPasteMode("none");
	};

	const copyHandler = () => {
		setPasteMode("paste");
		setLastClicked(null);
	};

	const copyUntilEndHandler = () => {
		setPasteMode("pasteUntilEnd");
		setLastClicked(null);
	};

	const emptyHandler = () => {
		for (const i of clickedChords) {
			chordRefs[i].current.value = "";
		}
		resetHandler();
	};

	// Takes in string lyrics and turns each into a string and input div
	const renderItems = () => {
		return selectedSong.lyrics.split("\n").map((item, idx) => {
			let chordStyles = {};
			if (props.isCopyMode) {
				if (idx === lastClicked) {
					chordStyles = {
						// ...chordStyles,
						backgroundColor: Colors.primary,
					};
				} else if (clickedChords.indexOf(idx) !== -1) {
					chordStyles = {
						// ...chordStyles,
						backgroundColor: Colors.primaryLight,
					};
				}
			}

			return (
				<div key={idx}>
					<input
						ref={chordRefs[idx]}
						id={idx}
						className={ui["dashed-input"]}
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
						ref={lyricRefs[idx]}
						className={styles["lyric-line"]}
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
		});
	};

	const bottomOption = (label, onClick) => {
		return (
			<span className={ui.pointer} onClick={onClick}>
				&nbsp;&nbsp;&nbsp;&nbsp;{label}&nbsp;&nbsp;&nbsp;&nbsp;
			</span>
		);
	};

	if (!chordRefs || !lyricRefs) {
		return <LoadingCircle />;
	}

	return (
		<div>
			{props.isCopyMode && (
				<div className={styles["toolbar"]}>
					{bottomOption("Clear", resetHandler)}|
					{bottomOption("Copy", copyHandler)}|
					{bottomOption("Copy until end", copyUntilEndHandler)}|
					{bottomOption("Empty", emptyHandler)}
				</div>
			)}
			<h2 className={ui["song-subtitle"]}>Lyrics</h2>
			{selectedSong.lyrics === "" ? (
				<p className={styles["lyric-line"]}>No lyrics found.</p>
			) : (
				renderItems()
			)}
		</div>
	);
}

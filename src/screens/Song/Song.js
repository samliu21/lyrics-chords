import React, { useRef, useEffect, useCallback, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import * as songsActions from "../../store/actions/songsActions";
import {
	compareSongsByValue,
	getUsername,
	incrementViewCount,
	updateSongToDatabase,
} from "../../util";
import InfoBar from "../../components/InfoBar/InfoBar";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import LyricsBlock from "../../components/LyricsBlock/LyricsBlock";
import PulledLyricsBlock from "../../components/PulledLyricsBlock/PulledLyricsBlock";
import SaveBar from "../../components/SaveBar/SaveBar";
import StrummingPatternBlock from "../../components/StrummingPatternBlock/StrummingPatternBlock";
import { styles } from "./SongStyles";

export default function Song(props) {
	const stateReceived = useRef(false);
	const hasUnsavedChanges = useRef(false);

	// If pulled lyrics are being fetched, use Fetching... text
	const isViewOnly = useSelector(
		(state) => state.selectedSong.isSongPageView
	);
	const songLink = useSelector((state) => state.selectedSong.songLink);
	const isFetching = useSelector((state) => state.selectedSong.isFetching);
	const isAdmin = useSelector((state) => state.auth.admin);

	const dispatch = useDispatch();
	const history = useHistory();

	// References to title and artist inputs
	const nameRef = createRef();
	const artistRef = createRef();

	const path = history.location.pathname.split("/");

	const selectedSong = useSelector((state) => {
		const list = isViewOnly
			? state.songs.publicSongs
			: state.songs.userSongs;
		// On app refresh, redux state is reset, and state reverts to its initial store
		// If state is empty, we wait for request to be issued
		if (!list) {
			return null;
		} else {
			stateReceived.current = true;
		}

		const id = +props.match.params.id;
		const username = props.match.params.username;
		return list.find((song) => {
			return song.id === id && song.creator === username;
		});
	});

	const originalSong = useRef(selectedSong);

	// Increment views
	useEffect(() => {
		const databaseCall = async () => {
			try {
				await incrementViewCount(selectedSong.id);

				// If view already exists for this person, error will be thrown so this next line won't be ran
				dispatch(songsActions.incrementView(selectedSong.id));
			} catch (err) {
				console.log(err.response ? err.response.data : err.message);
			}
		};

		if (selectedSong && selectedSong.public) {
			databaseCall();
		}
	}, [selectedSong, dispatch]);

	// On react route change, confirm that the user wants to leave with unsaved changes
	useEffect(() => {
		if (!isViewOnly) {
			const unblock = history.block(() => {
				const ogSong = originalSong.current;

				if (
					hasUnsavedChanges.current ||
					!compareSongsByValue(ogSong, selectedSong)
				) {
					// Prompt the user for confirmation
					const response = window.confirm(
						"You have unsaved changes! Are you sure you want to leave?"
					);

					// Replace redux state with most recent form
					if (response) {
						dispatch(songsActions.replaceSong(ogSong.id, ogSong));
					}
					return response;
				}

				return true;
			});

			return () => unblock();
		}
	}, [selectedSong, history, dispatch, isViewOnly]);

	// Show are you sure you want to leave upon refresh or closing the page (not for react routing)
	// We don't need to dispatch originalSong.current to the redux state because the redux state is being reset anyways after refresh
	const componentCleanup = useCallback(
		(event) => {
			if (
				hasUnsavedChanges.current ||
				!compareSongsByValue(selectedSong, originalSong.current)
			) {
				event.preventDefault();
				event.returnValue = "";
			}
		},
		[selectedSong]
	);

	// On page refresh or x, confirm that the user wants to leave with unsaved changes
	useEffect(() => {
		if (!isViewOnly) {
			window.addEventListener("beforeunload", componentCleanup);

			return () =>
				window.removeEventListener("beforeunload", componentCleanup);
		}
	}, [componentCleanup, isViewOnly]);

	// Check that the user is authenticated
	useEffect(() => {
		const validateUsername = async () => {
			// Double check (important!! if you press song -> back button -> same song again)
			if (path[path.length - 1] === "view") {
				return;
			}

			const linkUsername = props.match.params.username;

			const username = await getUsername();
			// Redirect to view only if usernames don't line up
			if (linkUsername !== username) {
				const id = props.match.params.id;

				history.push(`/songs/${linkUsername}/${id}/view`);
			}
		};

		if (!isAdmin && !isViewOnly) {
			validateUsername();
		}
	}, [
		props.match.params.username,
		history,
		songLink,
		isAdmin,
		isViewOnly,
		path,
		props.match.params.id,
	]);

	// When the page is reloaded (e.g. a new URL is entered), validate URL
	useEffect(() => {
		const songExists = async () => {
			// If song doesn't exist in view only page as well
			if (path[path.length - 1] === "view") {
				if (!selectedSong && stateReceived.current) {
					history.push("/songs/public");
				}
				return;
			}

			// If the songs are still being fetched, an undefined selectedSong should not trigger a redirect
			// Only if songs have been fetched and there still is no match for the URL parameters, should we redirect
			if (!selectedSong && stateReceived.current) {
				const linkUsername = props.match.params.username;
				const id = props.match.params.id;

				// Attempt to redirect to view page (if the user wants to share and displays a public link), but if song truly doesn't exist, will be handled there
				history.push(`/songs/${linkUsername}/${id}/view`);
			} else if (selectedSong) {
				if (!originalSong.current) {
					originalSong.current = selectedSong;
				}
			}
		};

		// If name was switched, the info must be validated
		songExists();
	}, [
		selectedSong,
		dispatch,
		history,
		songLink,
		props.match.params.username,
		props.match.params.id,
		path,
	]);

	// Allows components to change hasUnsavedChanges
	const setUnsavedChanges = (value) => {
		if (hasUnsavedChanges.current !== value) {
			hasUnsavedChanges.current = value;
		}
	};

	// Update original song to be the most recently saved version
	const dispatchSong = () => {
		// Get lyrics and chords
		let newLyrics = "";
		let newChords = "";
		console.log(selectedSong.lyrics.split("\n").length);
		for (let i = 0; i < selectedSong.lyrics.split("\n").length; ++i) {
			const lyricsInput = document.getElementById(`l${i}`);
			// lyricsInput and chordsInpu can be null if lyric is empty, and converted to <br /><br />
			newLyrics += `${lyricsInput ? lyricsInput.innerText : ""}\n`;
			const chordsInput = document.getElementById(`c${i}`);
			newChords += `${chordsInput ? chordsInput.value : ""}\n`;
		}

		// Get title and artist
		const newName = nameRef.current.value;
		const newArtist = artistRef.current.value;

		// Get strumming pattern
		const newStrummingPattern =
			document.getElementById("strumming_pattern").value;
		// Get pulled lyrics
		const newPulledLyrics =
			document.getElementById("pulled_lyrics").innerText;

		originalSong.current = {
			...selectedSong,
			lyrics: newLyrics,
			chords: newChords,
			name: newName,
			artist: newArtist,
			strumming_pattern: newStrummingPattern,
			pulled_lyrics: newPulledLyrics,
		};

		// Update to database and update redux state
		updateSongToDatabase(originalSong.current);
		dispatch(songsActions.updateSong(selectedSong.id, "lyrics", newLyrics));
		dispatch(songsActions.updateSong(selectedSong.id, "chords", newChords));
		dispatch(songsActions.updateSong(selectedSong.id, "name", newName));
		dispatch(songsActions.updateSong(selectedSong.id, "artist", newArtist));
		dispatch(
			songsActions.updateSong(
				selectedSong.id,
				"strumming_pattern",
				newStrummingPattern
			)
		);
		dispatch(
			songsActions.updateSong(
				selectedSong.id,
				"pulled_lyrics",
				newPulledLyrics
			)
		);
		setUnsavedChanges(false);
	};

	// Enter causes blur
	const preventEnterHandler = (event) => {
		setUnsavedChanges(true);

		if (event.key === "Enter") {
			event.preventDefault();
			event.target.blur();
		}
	};

	// On title or artist blur
	const inputBlur = () => {
		const name = nameRef.current.value;
		const artist = artistRef.current.value;

		const id = selectedSong.id;

		// If nothing changed, don't make database call
		if (selectedSong.name === name && selectedSong.artist === artist) {
			return;
		}
		const choice = name !== selectedSong.name ? "name" : "artist";
		const val = name !== selectedSong.name ? name : artist;

		dispatch(songsActions.updateSong(id, choice, val));
	};

	if (!selectedSong) {
		return <LoadingCircle />;
	}

	const editableKwargs = isViewOnly ? {} : { editable: true };
	const inputKwargs = isViewOnly ? { readOnly: true } : {};

	return (
		<div id="songRoot" style={styles.container}>
			{isFetching && <LoadingCircle />}

			{/* Information about creator  */}
			<InfoBar selectedSong={selectedSong} />

			{/* Save bar  */}
			{!isViewOnly && (
				<SaveBar item={selectedSong} onSave={dispatchSong} />
			)}

			{/* Title  */}
			<input
				style={styles.title}
				defaultValue={selectedSong.name}
				placeholder="Title"
				onKeyDown={preventEnterHandler}
				onBlur={inputBlur}
				ref={nameRef}
				{...inputKwargs}
			/>

			{/* Artist  */}
			<input
				style={styles.artist}
				defaultValue={selectedSong.artist}
				placeholder="Artist"
				onKeyDown={preventEnterHandler}
				onBlur={inputBlur}
				ref={artistRef}
				{...inputKwargs}
			/>

			<StrummingPatternBlock
				selectedSong={selectedSong}
				setUnsavedChanges={setUnsavedChanges}
				{...editableKwargs}
			/>

			<LyricsBlock
				selectedSong={selectedSong}
				setUnsavedChanges={setUnsavedChanges}
				{...editableKwargs}
			/>

			{!isViewOnly && (
				<PulledLyricsBlock
					selectedSong={selectedSong}
					setUnsavedChanges={setUnsavedChanges}
				/>
			)}
		</div>
	);
}

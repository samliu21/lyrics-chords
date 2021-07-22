import React, { useRef, useEffect, useCallback, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import * as selectedSongActions from "../../store/actions/selectedSongActions";
import * as songsActions from "../../store/actions/songsActions";
import {
	compareSongsByValue,
	getSplitChords,
	getUsername,
	incrementViewCount,
	turnIntoLink,
	updateSongAttributeToDatabase,
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
	const switchedName = useRef(false);
	const hasUnsavedChanges = useRef(false);
	const viewAdded = useRef(false);

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
	const creator = isViewOnly ? path[path.length - 3] : path[path.length - 2];

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

		return list.find((song) => {
			const link = turnIntoLink(song.artist, song.name);

			return link === songLink && song.creator === creator;
		});
	});

	const originalSong = useRef(selectedSong);

	// If name was switched, then the song must exist
	if (switchedName.current && selectedSong) {
		switchedName.current = false;
	}

	// Increment views
	useEffect(() => {
		const databaseCall = async () => {
			viewAdded.current = true;
			try {
				await incrementViewCount(selectedSong.id);

				// If view already exists for this person, error will be thrown so this next line won't be ran
				dispatch(songsActions.incrementView(selectedSong.id));
			} catch (err) {
				console.log(err.response ? err.response.data : err.message);
			}
		};

		if (selectedSong && !viewAdded.current) {
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

					// Replace redux state with most recently saved form
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
		if (isViewOnly) {
			window.addEventListener("beforeunload", componentCleanup);

			return () =>
				window.removeEventListener("beforeunload", componentCleanup);
		}
	}, [componentCleanup]);

	// Check that the user is authenticated
	useEffect(() => {
		const validateUsername = async () => {
			if (path[path.length - 1] === "view") {
				return;
			}
			const linkUsername = props.match.params.username;

			const username = await getUsername();
			// Redirect if usernames don't line up
			if (linkUsername !== username) {
				// Attempt to redirect to view page (if the user wants to share and displays a public link), but if song truly doesn't exist, will be handled there
				history.push(`/songs/${linkUsername}/${songLink}/view`);
			}
		};

		if (!isAdmin && !isViewOnly) {
			validateUsername();
		}
	}, [props.match.params.username, history, songLink, isAdmin]);

	// When the page is reloaded (e.g. a new URL is entered), validate URL
	useEffect(() => {
		const songExists = async () => {
			// Press public song, back, song again
			if (path[path.length - 1] === "view") {
				return;
			}

			// If the songs are still being fetched, an undefined selectedSong should not trigger a redirect
			// Only if songs have been fetched and there still is no match for the URL parameters, should we redirect
			if (!selectedSong && stateReceived.current) {
				const linkUsername = props.match.params.username;
				// Attempt to redirect to view page (if the user wants to share and displays a public link), but if song truly doesn't exist, will be handled there
				history.push(`/songs/${linkUsername}/${songLink}/view`);
			} else if (selectedSong) {
				if (!originalSong.current) {
					originalSong.current = selectedSong;
				}

				const splitChords = getSplitChords(
					selectedSong.chords,
					selectedSong.lyrics
				);
				dispatch(selectedSongActions.setSelectedSong(splitChords));
			}
		};

		// If name was switched, the info must be validated
		if (!switchedName.current) {
			songExists();
		}
	}, [
		selectedSong,
		dispatch,
		history,
		songLink,
		props.match.params.username,
	]);

	// Allows components to change hasUnsavedChanges
	const setUnsavedChanges = (value) => {
		if (hasUnsavedChanges.current !== value) {
			hasUnsavedChanges.current = value;
		}
	};

	// Update original song to be the most recently saved version
	const updateOriginalSong = () => {
		originalSong.current = { ...selectedSong };
	};

	// Enter causes blur
	const preventEnterHandler = (event) => {
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
		updateSongAttributeToDatabase(id, choice, val);

		const newLink = `/songs/${selectedSong.creator}/${turnIntoLink(
			artist,
			name
		)}`;

		switchedName.current = true;
		history.replace(newLink);
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
				<SaveBar
					item={selectedSong}
					setUnsavedChanges={setUnsavedChanges}
					onSave={updateOriginalSong}
				/>
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

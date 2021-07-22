import React, { useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as selectedSongActions from "../../store/actions/selectedSongActions";
import * as songsActions from "../../store/actions/songsActions";
import { useHistory } from "react-router";

import EditableComponent from "../../components/EditableComponent/EditableComponent";
import StrummingPatternBlock from "../../components/StrummingPatternBlock/StrummingPatternBlock";
import LyricsBlock from "../../components/LyricsBlock/LyricsBlock";
import PulledLyricsBlock from "../../components/PulledLyricsBlock/PulledLyricsBlock";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import SaveBar from "../../components/SaveBar/SaveBar";
import InfoBar from "../../components/InfoBar/InfoBar";
import { styles } from "./SongStyles";
import {
	turnIntoLink,
	getUsername,
	getSplitChords,
	compareSongsByValue,
	getToken,
} from "../../util";
import axios from "axios";

export default function Song(props) {
	const stateReceived = useRef(false);
	const switchedName = useRef(false);
	const hasUnsavedChanges = useRef(false);
	const viewAdded = useRef(false);

	// If pulled lyrics are being fetched, use Fetching... text
	const isFetching = useSelector((state) => state.selectedSong.isFetching);
	const isAdmin = useSelector((state) => state.auth.admin);
	// const songLink = useSelector((state) => state.selectedSong.songLink);
	const dispatch = useDispatch();
	const history = useHistory();

	const path = history.location.pathname.split("/");
	const songLink = path[path.length - 1];
	const creator = path[path.length - 2];

	const selectedSong = useSelector((state) => {
		// On app refresh, redux state is reset, and state reverts to its initial store
		// If state is empty, we issue a fetch songs request
		if (!state.songs.userSongs) {
			dispatch(songsActions.getUserSongs());
			return null;
		} else {
			stateReceived.current = true;
		}

		return state.songs.userSongs.find((song) => {
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
				const response = await axios.post(
					"/api/views/increment",
					{
						songId: selectedSong.id,
					},
					{
						withCredentials: true,
						headers: {
							"Content-Type": "application/json",
							"X-CSRFToken": getToken(),
						},
					}
				);
				console.log(response.data);
			} catch (err) {
				console.log(err.response.data);
			}
		};

		if (selectedSong && !viewAdded.current) {
			databaseCall();
		}
	}, [selectedSong]);

	// On react route change, confirm that the user wants to leave with unsaved changes
	useEffect(() => {
		const unblock = history.block(() => {
			const ogSong = originalSong.current;
			// ogSong != selectedSong is for fetch lyrics
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
	}, [selectedSong, history, dispatch]);

	// Show are you sure you want to leave upon refresh or closing the page (NOT REACT ROUTING)
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
		window.addEventListener("beforeunload", componentCleanup);

		return () =>
			window.removeEventListener("beforeunload", componentCleanup);
	}, [componentCleanup]);

	// Check that the user is authenticated
	useEffect(() => {
		const validateUsername = async () => {
			const linkUsername = props.match.params.username;

			const username = await getUsername();
			// Redirect if usernames don't line up
			if (linkUsername !== username) {
				// Attempt to redirect to view page (if the user wants to share and displays a public link), but if song truly doesn't exist, will be handled there
				history.push(`/songs/${linkUsername}/${songLink}/view`);
			}
		};

		if (!isAdmin) {
			validateUsername();
		}
	}, [props.match.params.username, history, songLink, isAdmin]);

	// When the page is reloaded (e.g. a new URL is entered), validate URL
	useEffect(() => {
		// Validate that one of the user's song matches the songLink
		const validateUsername = async () => {
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
			validateUsername();
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

	// Upon name or artist change, switchedName.current should be set
	const switchedNameHandler = () => {
		switchedName.current = true;
	};

	if (!selectedSong) {
		return <LoadingCircle />;
	}

	return (
		<div id="songRoot" style={styles.container}>
			{isFetching && <LoadingCircle />}

			<InfoBar selectedSong={selectedSong} />

			<SaveBar
				item={selectedSong}
				setUnsavedChanges={setUnsavedChanges}
				onSave={updateOriginalSong}
			/>

			<EditableComponent
				style={styles.title}
				title="name"
				item={selectedSong}
				content={selectedSong.name}
				tag="h1"
				switchedNameHandler={switchedNameHandler}
			/>
			<EditableComponent
				style={styles.artist}
				title="artist"
				item={selectedSong}
				content={selectedSong.artist}
				tag="h2"
				switchedNameHandler={switchedNameHandler}
			/>

			<StrummingPatternBlock
				songId={selectedSong.id}
				setUnsavedChanges={setUnsavedChanges}
				editable
			/>

			<LyricsBlock
				songId={selectedSong.id}
				setUnsavedChanges={setUnsavedChanges}
				editable
			/>

			<PulledLyricsBlock
				songId={selectedSong.id}
				setUnsavedChanges={setUnsavedChanges}
			/>
		</div>
	);
}

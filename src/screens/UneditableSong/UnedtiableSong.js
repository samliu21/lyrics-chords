import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as selectedSongActions from "../../store/actions/selectedSongActions";
import * as songsActions from "../../store/actions/songsActions";
import { useHistory } from "react-router";

import StrummingPatternBlock from "../../components/StrummingPatternBlock/StrummingPatternBlock";
import LyricsBlock from "../../components/LyricsBlock/LyricsBlock";
import { styles } from "./UneditableSongStyles";
import { turnIntoLink, getSplitChords, getToken } from "../../util";
import InfoBar from "../../components/InfoBar/InfoBar";

export default function UneditableSong(props) {
	const linkUsername = useRef(props.match.params.username);
	const viewAdded = useRef(false);

	const songLink = useSelector((state) => state.selectedSong.songLink);
	const [isRendering, setIsRendering] = useState(true);
	const [stateReceived, setStateReceived] = useState(false);

	const dispatch = useDispatch();
	const history = useHistory();

	const selectedSong = useSelector((state) => {
		// On app refresh, redux state is reset, and state reverts to its initial store
		// If state is empty, we issue a fetch songs request
		if (!state.songs.publicSongs) {
			dispatch(songsActions.getPublicSongs());
			return;
		} else {
			if (!stateReceived) {
				setStateReceived(true);
			}
		}

		const song = state.songs.publicSongs.find((song) => {
			const link = turnIntoLink(song.artist, song.name);
			return link === songLink && song.creator === linkUsername.current;
		});

		return song;
	});

	if (!selectedSong && songLink && stateReceived) {
		history.push("/songs/public");
	}

	// Increment views
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
				console.log(err.response ? err.response.data : err.message);
			}
		};

		if (selectedSong && !viewAdded.current) {
			databaseCall();
		}
	}, [selectedSong]);

	// When the page is reloaded (e.g. a new URL is entered), validate URL
	useEffect(() => {
		// Validate that the username matches and one of the user's song matches the songLink
		const validate = async () => {
			// If the songs are still being fetched, an undefined selectedSong should not trigger a redirect
			// Only if songs have been fetched, the songLink has been obtained from redux, and there still is no match for the URL parameters, should we redirect
			if (!selectedSong && songLink && stateReceived) {
				unauthenticated(
					"/songs/public",
					"The inputted song could not be found"
				);
			} else if (selectedSong) {
				const splitChords = getSplitChords(
					selectedSong.chords,
					selectedSong.lyrics
				);
				dispatch(selectedSongActions.setSelectedSong(splitChords));

				setIsRendering(false);
			}
		};

		// Redirect user to unauthenticated screen
		const unauthenticated = (url, message) => {
			history.push({
				pathname: "/accounts/unauthenticated",
				state: {
					url: url,
					message: message,
				},
			});
			return;
		};

		validate();
	}, [selectedSong, dispatch, history, songLink, stateReceived]);

	// While rendering, show temporary data
	// Although one may think !selectedSong is a sufficient standalone, we need isRendering as a state value to trigger a re-render
	if (isRendering || !selectedSong) {
		return (
			<div className="horizontal-default">
				<h2>Retrieving data...</h2>
			</div>
		);
	}

	return (
		<div>
			<div id="songRoot" style={styles.container}>
				<InfoBar selectedSong={selectedSong} />

				<h1 style={styles.title}>{selectedSong.name}</h1>
				<h2 style={styles.artist}>{selectedSong.artist}</h2>

				<StrummingPatternBlock songId={selectedSong.id} />

				<LyricsBlock songId={selectedSong.id} />
			</div>
		</div>
	);
}

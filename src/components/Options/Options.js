import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import * as songsActions from "../../store/actions/songsActions";
import * as selectedSongActions from "../../store/actions/selectedSongActions";
import DropMenu from "../DropMenu/DropMenu";

export default function Options() {
	const isSongPage = useSelector((state) => state.selectedSong.isSongPage);
	const songLink = useSelector((state) => state.selectedSong.songLink);

	const selectedSong = useSelector((state) => {
		if (state.songs.userSongs) {
			return state.songs.userSongs.find((song) => song.id === +songLink);
		} else {
			return [];
		}
	});

	const history = useHistory();
	const dispatch = useDispatch();

	// Web scrape lyrics and dispatch to redux
	const getLyrics = async () => {
		try {
			dispatch(selectedSongActions.setFetching(true));

			const response = await axios.get(
				`/api/lyrics/${selectedSong.artist}**${selectedSong.name}`
			);
			const pulledLyrics = response.data.trim();
			dispatch(
				songsActions.updateSong(
					selectedSong.id,
					"pulled_lyrics",
					pulledLyrics
				)
			);
		} catch (err) {
			const errorText = err.response
				? err.response.data
				: "An error occurred.";
			dispatch(
				songsActions.updateSong(
					selectedSong.id,
					"pulled_lyrics",
					errorText
				)
			);
		} finally {
			dispatch(selectedSongActions.setFetching(false));
		}
	};

	// On lyric transfer, push new lyrics to redux state
	const transferLyricsHandler = () => {
		// const lyrics = selectedSong.pulled_lyrics.replaceAll("\n", "~");
		const lyrics = selectedSong.pulled_lyrics;
		dispatch(songsActions.updateSong(selectedSong.id, "lyrics", lyrics));
	};

	// On help, redirect to help page
	const helpRedirectHandler = () => {
		history.push("/help");
	};

	const items = [
		{
			text: "Fetch Lyrics",
			onClick: () => getLyrics(),
			condition: isSongPage,
		},
		{
			text: "Transfer Lyrics",
			onClick: () => transferLyricsHandler(),
			condition: isSongPage,
		},
		{
			text: "Help",
			onClick: () => helpRedirectHandler(),
			condition: true,
		},
	];

	return <DropMenu title="Options" items={items} />;
}

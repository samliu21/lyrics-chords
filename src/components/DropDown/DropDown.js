import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import * as songsActions from "../../store/actions/songsActions";
import * as selectedSongActions from "../../store/actions/selectedSongActions";
import { useHistory } from "react-router";

import { styles } from "./DropDownStyles";
import { getSplitChords, turnIntoLink } from "../../util";

export default function DropDown() {
	const [menuOpen, setMenuOpen] = useState(false);
	const isSongPage = useSelector((state) => state.selectedSong.isSongPage);
	const songLink = useSelector((state) => state.selectedSong.songLink);

	const selectedSong = useSelector((state) => {
		if (state.songs.userSongs) {
			return state.songs.userSongs.find((song) => {
				const link = turnIntoLink(song.artist, song.name);
				return link === songLink;
			});
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
			const errorText = err.response ? err.response.data : "An error occurred.";
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
		const lyrics = selectedSong.pulled_lyrics.replaceAll("\n", "~");
		dispatch(songsActions.updateSong(selectedSong.id, "lyrics", lyrics));

		if (!selectedSong.splitChords) {
			const splitChords = getSplitChords(selectedSong.chords, lyrics);
			dispatch(selectedSongActions.setSelectedSong(splitChords));
		}
	};

	// On help, redirect to help page
	const helpRedirectHandler = () => {
		history.push("/help");
	};

	return (
		// To prevent from spanning the entire width
		<div style={styles.outerContainer}>
			<div
				style={styles.container}
				onMouseEnter={() => setMenuOpen(true)}
				onMouseLeave={() => setMenuOpen(false)}
			>
				<div
					className="navBarLink navBarHover"
					style={styles.hoverable}
				>
					Options
				</div>

				{/* Necessary so that position absolute starts at the top left corner of this */}
				<div style={styles.outerDiv}>
					{menuOpen && (
						<div style={styles.options}>
							{isSongPage && (
								<div>
									<p
										className="dropdown-option"
										onClick={getLyrics}
									>
										Fetch Lyrics
									</p>
									<p
										className="dropdown-option"
										onClick={transferLyricsHandler}
									>
										Transfer Lyrics
									</p>
								</div>
							)}
							<p
								className="dropdown-option"
								onClick={helpRedirectHandler}
							>
								Help
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

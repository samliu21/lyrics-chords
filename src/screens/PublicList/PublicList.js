import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import SongBlock from "../../components/SongBlock/SongBlock";
import UneditableSongBlock from "../../components/UneditableSongBlock/UneditableSongBlock";
import SearchBar from "../../components/SearchBar/SearchBar";
import { styles } from "./PublicListStyles";
import * as songsActions from "../../store/actions/songsActions";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";

export default function PublicList() {
	const isAdmin = useSelector((state) => state.auth.admin);
	const filteredPublicSongs = useSelector(
		(state) => state.songs.filteredPublicSongs
	);
	const username = useSelector((state) => state.auth.username);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!filteredPublicSongs) {
			dispatch(songsActions.getPublicSongs());
		}

		// return () => dispatch(songsActions.setFilteredPublicSongs("reset"))
	}, [dispatch, filteredPublicSongs]);

	useEffect(() => {
		return () => dispatch(songsActions.setFilteredPublicSongs("reset"));
	}, [dispatch]);

	if (!filteredPublicSongs) {
		return <LoadingCircle />;
	}

	return (
		<div style={styles.container}>
			<SearchBar public />
			<h1 style={styles.title}>Public Songs</h1>

			{filteredPublicSongs.map((song) => {
				if (username === song.creator || isAdmin) {
					return (
						<SongBlock
							key={song.id}
							id={song.id}
							item={song}
							public
						/>
					);
				} else {
					return (
						<UneditableSongBlock
							key={song.id}
							id={song.id}
							item={song}
						/>
					);
				}
			})}
		</div>
	);
}

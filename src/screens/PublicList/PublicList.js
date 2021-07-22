import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import SongBlock from "../../components/SongBlock/SongBlock";
import UneditableSongBlock from "../../components/UneditableSongBlock/UneditableSongBlock";
import SearchBar from "../../components/SearchBar/SearchBar";
import { styles } from "./PublicListStyles";
import * as songsActions from "../../store/actions/songsActions";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import axios from "axios";
import { getToken } from "../../util";

export default function PublicList() {
	const isAdmin = useSelector((state) => state.auth.admin);
	const views = useSelector((state) => state.songs.views);
	// const condition = views ? 
	const filteredPublicSongs = useSelector(
		(state) => state.songs.filteredPublicSongs
	);
	const username = useSelector((state) => state.auth.username);

	const dispatch = useDispatch();

	useEffect(() => {
		const database = async () => {
			const ids = filteredPublicSongs.map((song) => song.id);
			const response = await axios.post(
				"/api/views/get_all_views",
				{
					ids: ids,
				},
				{
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
						"X-CSRFToken": getToken(),
					},
				}
			);

			dispatch(songsActions.setViews(response.data));
		};

		if (filteredPublicSongs && !views) {
			database();
		}
	}, [filteredPublicSongs, dispatch, views]);

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
							views={views ? views[song.id] : null}
							public
						/>
					);
				} else {
					return (
						<UneditableSongBlock
							key={song.id}
							id={song.id}
							views={views ? views[song.id] : null}
							item={song}
						/>
					);
				}
			})}
		</div>
	);
}

import React, { useState, useEffect } from "react";
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
	const filteredPublicSongs = useSelector(
		(state) => state.songs.filteredPublicSongs
	);
	const username = useSelector((state) => state.auth.username);
	const [viewsDict, setViewsDict] = useState();

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

			setViewsDict(response.data);
		};

		if (filteredPublicSongs) {
			database();
		}
	}, [filteredPublicSongs]);

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
							views={viewsDict ? viewsDict[song.id] : null}
							public
						/>
					);
				} else {
					return (
						<UneditableSongBlock
							key={song.id}
							id={song.id}
							views={viewsDict ? viewsDict[song.id] : null}
							item={song}
						/>
					);
				}
			})}
		</div>
	);
}

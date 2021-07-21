import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as songsActions from "../../store/actions/songsActions";
import { useHistory } from "react-router-dom";

import SongBlock from "../../components/SongBlock/SongBlock";
import AddSongButton from "../../components/AddSongButton/AddSongButton";
import { styles } from "./SongListStyles";
import { getUsername, getActivationStatus } from "../../util";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import SearchBar from "../../components/SearchBar/SearchBar";

export default function SongList(props) {
	const { username } = props.match.params;

	const [isFavourites, setIsFavourites] = useState(false);
	const isAdmin = useSelector((state) => state.auth.admin);

	const history = useHistory();

	const path = history.location.pathname.split("/");
	const all = path[2] === "all";

	let condition;
	if (all) {
		condition = (state) =>
			isFavourites && state.songs.filteredSongs
				? state.songs.filteredUserSongs.filter(
						(song) => song.is_favourite
				  )
				: state.songs.filteredUserSongs;
	} else {
		condition = (state) => {
			if (!state.songs.filteredUserSongs) {
				return null;
			} else if (isFavourites) {
				return state.songs.filteredUserSongs.filter(
					(song) => song.is_favourite && song.creator === username
				);
			} else {
				return state.songs.filteredUserSongs.filter(
					(song) => song.creator === username
				);
			}
		};
	}

	const songList = useSelector(condition);

	const dispatch = useDispatch();

	useEffect(() => {
		const activated = async () => {
			const activationStatus = await getActivationStatus();

			if (!activationStatus) {
				history.push("/accounts/confirm-email");
				return;
			}
		};

		activated();
	}, [history]);

	useEffect(() => {
		const unlisten = history.listen(() => {
			dispatch(songsActions.setFilteredUserSongs("reset"));
		});

		return () => unlisten();
	}, [dispatch, history]);

	// Get song list on component mount
	useEffect(() => {
		// Get song list
		const getSongList = async () => {
			const response = await getUsername();

			if (isAdmin === false && response !== username) {
				history.push({
					pathname: "/accounts/unauthenticated",
					state: {
						url: !response
							? "/accounts/login"
							: `/songs/${response}`,
						message: "This is not your account",
					},
				});
				return;
			}

			if (!songList) {
				dispatch(songsActions.getUserSongs());
			}
		};

		getSongList();
	}, [username, history, dispatch, songList, isAdmin]);

	// While rendering, show temporary data
	if (!songList) {
		return <LoadingCircle />;
	}

	// Handle favourites click
	const favouritesHandler = () => {
		setIsFavourites((state) => !state);
	};

	return (
		<div style={styles.container}>
			<div
				style={styles.buttonContainer}
			>
				{!all && (
					<p className="important" onClick={favouritesHandler}>
						{isFavourites ? "ALL" : "FAVOURITES"}
					</p>
				)}
				<AddSongButton />
			</div>
			<SearchBar />

			<h1 style={styles.title}>
				{all
					? "All Songs"
					: "Your " + (isFavourites ? "Favourite " : "") + "Songs"}
			</h1>

			{songList.map((item) => (
				<SongBlock key={item.id} item={item} />
			))}
		</div>
	);
}

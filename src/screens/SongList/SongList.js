import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as songsActions from "../../store/actions/songsActions";

import SongBlock from "../../components/SongBlock/SongBlock";
import AddSongButton from "../../components/AddSongButton/AddSongButton";
import { styles } from "./SongListStyles";
import { getUsername, getActivationStatus } from "../../util";
import { useHistory } from "react-router-dom";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import SearchBar from "../../components/SearchBar/SearchBar";

export default function SongList(props) {
	const { username } = props.match.params;

	const isAdmin = useSelector((state) => state.auth.admin);

	const history = useHistory();

	const path = history.location.pathname.split("/");
	const all = path[2] === "all";

	let condition;
	if (all) {
		condition = (state) => state.songs.filteredUserSongs;
	} else {
		condition = (state) =>
			state.songs.filteredUserSongs
				? state.songs.filteredUserSongs.filter(
						(song) => song.creator === username
				  )
				: null;
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

			if (!isAdmin && response !== username) {
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

	return (
		<div style={styles.container}>
			<AddSongButton />
			<SearchBar />

			<h1 style={styles.title}>{all ? "All Songs" : "Your Songs"}</h1>

			{songList.map((item) => (
				<SongBlock key={item.id} item={item} />
			))}
		</div>
	);
}

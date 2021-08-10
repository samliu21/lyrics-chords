import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as songsActions from "../../store/actions/songsActions";
import { useHistory } from "react-router-dom";

import AddSongButton from "../../components/AddSongButton/AddSongButton";
import CapitalText from "../../components/CapitalText/CapitalText";
import { getUsername, getActivationStatus } from "../../util";
import layout from "../../styles/layout.module.css";
import ui from "../../styles/ui.module.css";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import SearchBar from "../../components/SearchBar/SearchBar";
import SongBlock from "../../components/SongBlock/SongBlock";

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
					(song) => {
						console.log(song.creator);
						return song.creator === username;
					}
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
				history.push(
					response ? `/songs/${response}` : "/accounts/login"
				);
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

	const allKwargs = all ? { public: true } : {};

	return (
		<div className={layout.container}>
			<div className={layout["horizontal-between"]}>
				{!all && (
					<CapitalText onClick={favouritesHandler}>
						{isFavourites ? "ALL" : "FAVOURITES"}
					</CapitalText>
				)}
				{!all && <AddSongButton />}
			</div>
			<SearchBar />

			<h1 className={ui.title}>
				{all
					? "All Songs"
					: "Your " + (isFavourites ? "Favourite " : "") + "Songs"}
			</h1>

			{songList.map((item) => (
				<SongBlock key={item.id} item={item} editable {...allKwargs} />
			))}
		</div>
	);
}

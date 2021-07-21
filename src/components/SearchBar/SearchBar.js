import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FuzzySearch from "fuzzy-search";
import { useHistory } from "react-router-dom";

import * as songsActions from "../../store/actions/songsActions";
import {
	AiOutlineSearch,
	AiFillCaretLeft,
	AiOutlineClose,
} from "react-icons/ai";
import { styles } from "./SearchBarStyles";
import "./searchbar.css";

export default function SearchBar(props) {
	const [open, setOpen] = useState(false);
	const [searchText, setSearchText] = useState("");
	const filterFunction = props.public ? (state) => state.songs.publicSongs : (state) => state.songs.userSongs;
	const songList = useSelector(filterFunction);

	const dispatch = useDispatch();
	const history = useHistory();

	// Close 
	useEffect(() => {
		const unlisten = history.listen(() => {
			setOpen(false);
			setSearchText("");
		});

		return () => unlisten();
	}, []);

	// Set search text on change
	const inputChangeHandler = (e) => {
		setSearchText(e.target.value);
	};

	// Reset filter
	const resetFilter = () => {
		setSearchText("");
		if (props.public) {
			dispatch(songsActions.setFilteredPublicSongs("reset"));
		} else {
			dispatch(songsActions.setFilteredUserSongs("reset"));
		}
	}

	// Perform filter on publicList using fuzzy-search library
	const filterList = () => {
		const searcher = new FuzzySearch(
			songList,
			["name", "artist", "creator"],
			{
				caseSensitive: false,
				sort: true,
			}
		);
		const result = searcher.search(searchText);

		if (props.public) {
			dispatch(songsActions.setFilteredPublicSongs(result));
		} else {
			dispatch(songsActions.setFilteredUserSongs(result));
		}
	}

	// Handles search button click
	const searchButtonHandler = () => {
		if (!open) {
			setOpen(true);
			return;
		}
		if (searchText === "") {
			resetFilter();
			return;
		}

		filterList();
	};

	// Close search bar
	const closeSearchHandler = () => {
		setOpen(false);
	};

	// Perform search upon enter press
	const inputKeydownHandler = (e) => {
		if (e.key === "Enter") {
			e.target.blur();
			e.preventDefault();
			searchButtonHandler();
		}
	};

	return (
		<div style={styles.container}>
			{open && (
				<AiFillCaretLeft
					style={styles.close}
					onClick={closeSearchHandler}
				/>
			)}
			{open && (
				<input
					style={styles.input}
					value={searchText}
					placeholder="Filter here"
					onChange={inputChangeHandler}
					onKeyDown={inputKeydownHandler}
				/>
			)}
			{open && <AiOutlineClose style={styles.x} onClick={resetFilter} />}
			<AiOutlineSearch style={styles.button} onClick={searchButtonHandler}>
				Search
			</AiOutlineSearch>
		</div>
	);
}

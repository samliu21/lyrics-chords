import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as songsActions from "../../store/actions/songsActions";

export default function FavouritesButton() {
	const [pressed, setPressed] = useState(false);

	const filteredUserSongs = useSelector((state) => state.songs.filteredUserSongs);

	const dispatch = useDispatch();

	const clickHandler = () => {
		if (!pressed) {
			const result = filteredUserSongs
			dispatch(songsActions.setFilteredUserSongs())
		}
	}

	return (
		<p className="important" onClick={clickHandler}>FAVOURITES</p>
	)
}
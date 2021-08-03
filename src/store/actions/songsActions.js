import axios from "axios";
import { getToken, sortSongsById } from "../../util";

export const ADD_SONG = "ADD_SONG";
export const GET_USER_SONGS = "GET_USER_SONGS";
export const GET_PUBLIC_SONGS = "GET_PUBLIC_SONGS";
export const DELETE_SONG = "DELETE_SONG";
export const UPDATE_SONG = "UPDATE_SONG";
export const REPLACE_SONG = "REPLACE_SONG";
export const SET_FILTERED_PUBLIC_SONGS = "SET_FILTERED_PUBLIC_SONGS";
export const SET_FILTERED_USER_SONGS = "SET_FILTERED_USER_SONGS";
export const SET_VIEWS = "SET_VIEWS";
export const INCREMENT_VIEW = "INCREMENT_VIEW";

export function copySong(song) {
	return async (dispatch) => {
		try {
			const newSong = {
				...song,
				public: false,
				is_favourite: false,
			};
			delete newSong["id"];
			delete newSong["creator"];

			const response = await axios.post("/api/songs/", newSong, {
				withCredentials: true,
				headers: {
					"X-CSRFToken": getToken(),
				},
			});

			dispatch({
				type: ADD_SONG,
				song: response.data,
			});
		} catch (err) {
			alert('Song could not be copied');
		}
	};
}

export function getUserSongs() {
	return async (dispatch) => {
		try {
			const response = await axios.get("/api/songs/", {
				withCredentials: true,
			});

			const userSongs = response.data;
			sortSongsById(userSongs);

			dispatch({
				type: GET_USER_SONGS,
				userSongs: userSongs,
			});
		} catch (err) {
			alert('There was an error getting your songs.')
			throw err;
		}
	};
}

export function getPublicSongs() {
	return async (dispatch) => {
		try {
			const response = await axios.get("/api/songs/public", {
				withCredentials: true,
			});

			const publicSongs = response.data;
			dispatch({
				type: GET_PUBLIC_SONGS,
				publicSongs: publicSongs,
			});
		} catch (err) {
			alert('There was an error getting public songs.')
			throw err;
		}
	};
}

export function addSong(username) {
	return async (dispatch) => {
		try {
			const response = await axios.post(
				"/api/songs/",
				{},
				{
					withCredentials: true,
					headers: {
						"X-CSRFToken": getToken(),
					},
				}
			);

			dispatch({
				type: ADD_SONG,
				song: response.data,
			});

			localStorage.removeItem(username);
		} catch (err) {
			alert("Failed to add song.")
			throw err;
		}
	};
}

export function deleteSong(id) {
	return async (dispatch) => {
		try {
			dispatch({
				type: DELETE_SONG,
				id: id,
			});

			axios.delete(`/api/songs/${id}/`, {
				withCredentials: true,
				headers: {
					"X-CSRFToken": getToken(),
				},
			});
		} catch (err) {
			alert('There was an error deleting the song.')
			throw err;
		}
	};
}

export function updateSong(id, type, value) {
	return {
		type: UPDATE_SONG,
		id: id,
		updateType: type,
		value: value,
	};
}

export function replaceSong(id, song) {
	return {
		type: REPLACE_SONG,
		id: id,
		song: song,
	};
}

export function setFilteredPublicSongs(songs) {
	return {
		type: SET_FILTERED_PUBLIC_SONGS,
		songs: songs,
	};
}

export function setFilteredUserSongs(songs) {
	return {
		type: SET_FILTERED_USER_SONGS,
		songs: songs,
	};
}

export function setViews(views) {
	return {
		type: SET_VIEWS,
		views: views,
	};
}

export function incrementView(id) {
	return {
		type: INCREMENT_VIEW,
		id: id,
	};
}

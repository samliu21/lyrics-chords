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

export function copySong(song, username) {
	return async (dispatch) => {
		try {
			const newSong = {};
			for (const key in song) {
				if (key !== "id") {
					newSong[key] = song[key];
				}
			}
			newSong["public"] = false;
			newSong["is_favourite"] = false;
			newSong["creator"] = username;

			const response = await axios.post("/api/songs/", newSong, {
				withCredentials: true,
				headers: {
					"X-CSRFToken": getToken(),
				},
			});
			newSong["id"] = response.data.id;

			dispatch({
				type: ADD_SONG,
				song: newSong,
			});
		} catch (err) {
			console.log(err.message);
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
			console.log(userSongs);
			sortSongsById(userSongs);

			dispatch({
				type: GET_USER_SONGS,
				userSongs: userSongs,
			});
		} catch (err) {
			console.log(err.message);
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
			console.log(err.message);
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
			console.log(response.data);
			const song = {
				id: response.data.id,
				name: "",
				artist: "",
				creator: username,
				lyrics: "",
				pulled_lyrics: "",
				chords: "",
				strumming_pattern: "",
				is_favourite: false,
				public: false,
			};

			dispatch({
				type: ADD_SONG,
				song: song,
			});

			localStorage.removeItem(username);
		} catch (err) {
			console.log(err.message);
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
			console.log(err.response ? err.response.data : err.message);
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

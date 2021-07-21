import {
	ADD_SONG,
	DELETE_SONG,
	SET_FILTERED_PUBLIC_SONGS,
	SET_FILTERED_USER_SONGS,
	UPDATE_SONG,
	REPLACE_SONG,
	GET_USER_SONGS,
	GET_PUBLIC_SONGS,
} from "../actions/songsActions";
import { sortSongsById } from "../../util";

import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const initialStore = {
	userSongs: null,
	publicSongs: null,
	filteredUserSongs: null,
	filteredPublicSongs: null,
};

function store(store = initialStore, action) {
	switch (action.type) {
		case GET_USER_SONGS:
			return {
				...store,
				userSongs: action.userSongs,
				filteredUserSongs: action.userSongs,
			};
		case GET_PUBLIC_SONGS:
			return {
				...store,
				publicSongs: action.publicSongs,
				filteredPublicSongs: action.publicSongs,
			};
		case ADD_SONG:
			const userSongs = store.userSongs.slice().concat(action.song);
			const filteredUserSongs = store.filteredUserSongs
				.slice()
				.concat(action.song);
			sortSongsById(userSongs);
			sortSongsById(filteredUserSongs);

			return {
				...store,
				userSongs: userSongs,
				filteredUserSongs: filteredUserSongs,
			};
		case DELETE_SONG:
			return {
				...store,
				userSongs: store.userSongs.filter(
					(song) => song.id !== action.id
				),
				publicSongs: store.publicSongs
					? store.publicSongs.filter((song) => song.id !== action.id)
					: null,
				filteredUserSongs: store.filteredUserSongs.filter(
					(song) => song.id !== action.id
				),
				filteredPublicSongs: store.filteredPublicSongs
					? store.filteredPublicSongs.filter(
							(song) => song.id !== action.id
					  )
					: null,
			};
		case UPDATE_SONG:
			const updatedSong = {
				...store.userSongs.find((song) => song.id === action.id),
				[action.updateType]: action.value,
			};
			if (!updatedSong) {
				return store;
			}

			const updatedUserSongs = store.userSongs
				.filter((song) => song.id !== action.id)
				.concat(updatedSong);
			const updatedFilteredUserSongs = store.filteredUserSongs
				.filter((song) => song.id !== action.id)
				.concat(updatedSong);
			sortSongsById(updatedUserSongs);
			sortSongsById(updatedFilteredUserSongs);

			if (store.publicSongs) {
				const updatedPublicSongs = store.publicSongs.filter(
					(song) => song.id !== action.id
				);
				const updatedFilteredPublicSongs =
					store.filteredPublicSongs.filter(
						(song) => song.id !== action.id
					);

				if (updatedSong.public) {
					updatedPublicSongs.push(updatedSong);
					updatedFilteredPublicSongs.push(updatedSong);
				}
				sortSongsById(updatedPublicSongs);
				sortSongsById(updatedFilteredPublicSongs);

				return {
					...store,
					userSongs: updatedUserSongs,
					publicSongs: updatedPublicSongs,
					filteredUserSongs: updatedFilteredUserSongs,
					filteredPublicSongs: updatedFilteredPublicSongs,
				};
			} else {
				return {
					...store,
					userSongs: updatedUserSongs,
					filteredUserSongs: updatedFilteredUserSongs,
				};
			}
		case REPLACE_SONG:
			if (true) {
				// Prevent scoping errors
				const updatedUserSongs = store.userSongs
					.filter((song) => song.id !== action.id)
					.concat(action.song);
				const updatedFilteredUserSongs = store.filteredUserSongs
					.filter((song) => song.id !== action.id)
					.concat(action.song);
				sortSongsById(updatedUserSongs);
				sortSongsById(updatedFilteredUserSongs);

				if (store.publicSongs) {
					const updatedPublicSongs = store.publicSongs.filter(
						(song) => song.id !== action.id
					);
					const updatedFilteredPublicSongs =
						store.filteredPublicSongs.filter(
							(song) => song.id !== action.id
						);

					if (action.song.public) {
						updatedPublicSongs.push(action.song);
						updatedFilteredPublicSongs.push(action.song);
					}
					sortSongsById(updatedPublicSongs);
					sortSongsById(updatedFilteredPublicSongs);

					return {
						...store,
						userSongs: updatedUserSongs,
						publicSongs: updatedPublicSongs,
						filteredUserSongs: updatedFilteredUserSongs,
						filteredPublicSongs: updatedFilteredPublicSongs,
					};
				} else {
					return {
						...store,
						userSongs: updatedUserSongs,
						filteredUserSongs: updatedFilteredUserSongs,
					};
				}
			} else {
				return initialStore;
			}
		case SET_FILTERED_PUBLIC_SONGS:
			if (action.songs === "reset") {
				return {
					...store,
					filteredPublicSongs: store.publicSongs,
				};
			}
			return {
				...store,
				filteredPublicSongs: action.songs,
			};
		case SET_FILTERED_USER_SONGS:
			if (action.songs === "reset") {
				return {
					...store,
					filteredUserSongs: store.userSongs,
				};
			}
			return {
				...store,
				filteredUserSongs: action.songs,
			};
		default:
			return store;
	}
}

const persistConfig = {
	key: "songs",
	storage: storage,
	blacklist: ["publicSongs", "filteredPublicSongs", "userSongs", "filteredUserSongs"],
};

export default persistReducer(persistConfig, store);

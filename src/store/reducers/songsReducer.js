import {
	ADD_SONG,
	DELETE_SONG,
	SET_FILTERED_PUBLIC_SONGS,
	SET_FILTERED_USER_SONGS,
	UPDATE_SONG,
	REPLACE_SONG,
	GET_USER_SONGS,
	GET_PUBLIC_SONGS,
	SET_VIEWS,
	INCREMENT_VIEW,
} from "../actions/songsActions";
import { sortSongsById } from "../../util";

const initialStore = {
	userSongs: null,
	publicSongs: null,
	filteredUserSongs: null,
	filteredPublicSongs: null,
	views: null,
};

function store(store = initialStore, action) {
	const sortByViews = (views, list) => {
		if (views) {
			list.sort((a, b) => views[a.id] < views[b.id]);
		}
	};

	if (action.type === GET_USER_SONGS) {
		return {
			...store,
			userSongs: action.userSongs,
			filteredUserSongs: action.userSongs,
		};
	} else if (action.type === GET_PUBLIC_SONGS) {
		if (store.views) {
			const sortedSongs = [...store.publicSongs];
			const sortedFilteredSongs = [...store.filteredPublicSongs];
			sortByViews(store.views, sortedSongs);
			sortByViews(store.views, sortedFilteredSongs);

			return {
				...store,
				publicSongs: sortedSongs,
				filteredPublicSongs: sortedFilteredSongs,
			};
		}

		return {
			...store,
			publicSongs: action.publicSongs,
			filteredPublicSongs: action.publicSongs,
		};
	} else if (action.type === ADD_SONG) {
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
	} else if (action.type === DELETE_SONG) {
		return {
			...store,
			userSongs: store.userSongs.filter((song) => song.id !== action.id),
			publicSongs: store.publicSongs.filter(
				(song) => song.id !== action.id
			),
			filteredUserSongs: store.filteredUserSongs.filter(
				(song) => song.id !== action.id
			),
			filteredPublicSongs: store.filteredPublicSongs.filter(
				(song) => song.id !== action.id
			),
		};
	} else if (action.type === UPDATE_SONG) {
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

		const updatedPublicSongs = store.publicSongs.filter(
			(song) => song.id !== action.id
		);
		const updatedFilteredPublicSongs = store.filteredPublicSongs.filter(
			(song) => song.id !== action.id
		);

		if (updatedSong.public) {
			updatedPublicSongs.push(updatedSong);
			updatedFilteredPublicSongs.push(updatedSong);

			sortByViews(store.views, updatedPublicSongs);
			sortByViews(store.views, updatedFilteredPublicSongs);
		}

		return {
			...store,
			userSongs: updatedUserSongs,
			publicSongs: updatedPublicSongs,
			filteredUserSongs: updatedFilteredUserSongs,
			filteredPublicSongs: updatedFilteredPublicSongs,
		};
	} else if (action.type === REPLACE_SONG) {
		const updatedUserSongs = store.userSongs
			.filter((song) => song.id !== action.id)
			.concat(action.song);
		const updatedFilteredUserSongs = store.filteredUserSongs
			.filter((song) => song.id !== action.id)
			.concat(action.song);
		sortSongsById(updatedUserSongs);
		sortSongsById(updatedFilteredUserSongs);

		const updatedPublicSongs = store.publicSongs.filter(
			(song) => song.id !== action.id
		);
		const updatedFilteredPublicSongs = store.filteredPublicSongs.filter(
			(song) => song.id !== action.id
		);

		if (action.song.public) {
			updatedPublicSongs.push(action.song);
			updatedFilteredPublicSongs.push(action.song);

			sortByViews(store.views, updatedPublicSongs);
			sortByViews(store.views, updatedFilteredPublicSongs);
		}

		return {
			...store,
			userSongs: updatedUserSongs,
			publicSongs: updatedPublicSongs,
			filteredUserSongs: updatedFilteredUserSongs,
			filteredPublicSongs: updatedFilteredPublicSongs,
		};
	} else if (action.type === SET_FILTERED_PUBLIC_SONGS) {
		if (action.songs === "reset") {
			return {
				...store,
				filteredPublicSongs: store.publicSongs,
			};
		}
		const sortedSongs = [...action.songs];
		sortByViews(store.views, sortedSongs);
		return {
			...store,
			filteredPublicSongs: sortedSongs,
		};
	} else if (action.type === SET_FILTERED_USER_SONGS) {
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
	} else if (action.type === SET_VIEWS) {
		const sortedSongs = [...store.publicSongs];
		const sortedFilteredSongs = [...store.filteredPublicSongs];
		sortByViews(action.views, sortedSongs);
		sortByViews(action.views, sortedFilteredSongs);

		return {
			...store,
			views: action.views,
			publicSongs: sortedSongs,
			filteredPublicSongs: sortedFilteredSongs,
		};
	} else if (action.type === INCREMENT_VIEW) {
		if (store.views) {
			const newViews = {
				...store.views,
				[action.id]:
					store.views[action.id] !== undefined
						? store.views[action.id] + 1
						: 0,
			};
			const newPublicSongs = [...store.publicSongs];
			const newFilteredPublicSongs = [...store.filteredPublicSongs];
			sortByViews(newViews, newPublicSongs);
			sortByViews(newViews, newFilteredPublicSongs);

			return {
				...store,
				views: newViews,
				publicSongs: newPublicSongs,
				filteredPublicSongs: newFilteredPublicSongs,
			};
		}
	} else {
		return store;
	}
}

export default store;

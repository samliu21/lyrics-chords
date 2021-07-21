import { SET_FETCHING, SET_IS_SONG_PAGE, SET_IS_SONG_PAGE_VIEW, SET_SELECTED_SONG, SET_SONG_LINK } from "../actions/selectedSongActions";

const initialStore = {
	splitChords: "",
	isFetching: false,
	isSongPage: false,
	isSongPageView: false,
	songLink: null,
};

export default function store(store = initialStore, action) {
	switch (action.type) {
		case SET_SELECTED_SONG:
			return {
				...store,
				splitChords: action.splitChords,
			}
		case SET_FETCHING:
			return {
				...store,
				isFetching: action.value,
			}
		case SET_IS_SONG_PAGE:
			return {
				...store,
				isSongPage: action.value,
			}
		case SET_IS_SONG_PAGE_VIEW:
			return {
				...store,
				isSongPageView: action.value,
			}
		case SET_SONG_LINK:
			return {
				...store,
				songLink: action.link,
			}
		default:
			return store;
	}
}
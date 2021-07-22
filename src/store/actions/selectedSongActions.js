export const SET_FETCHING = "SET_FETCHING";
export const SET_IS_SONG_PAGE = "SET_IS_SONG_PAGE";
export const SET_IS_SONG_PAGE_VIEW = "SET_IS_SONG_PAGE_VIEW";
export const SET_SONG_LINK = "SET_SONG_LINK";

// Whether lyrics are being API queried
export function setFetching(value) {
	return {
		type: SET_FETCHING,
		value: value,
	}
}

// Whether the user is currently on song page
export function setIsSongPage(value) {
	return {
		type: SET_IS_SONG_PAGE,
		value: value,
	}
}

// Whether the user is currently on the uneditable song page
export function setIsSongPageView(value) {
	return {
		type: SET_IS_SONG_PAGE_VIEW,
		value: value,
	}
}

// The current song link
export function setSongLink(link) {
	return {
		type: SET_SONG_LINK,
		link: link,
	}
}
import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";

import CustomSidebar from "../CustomSideBar/CustomSidebar";
import SongList from "../../screens/SongList/SongList";
import Song from "../../screens/Song/Song";
import ErrorScreen from "../Error/Error";
import Auth from "../../screens/Auth/Auth";
import Help from "../../screens/Help/Help";
import Home from "../../screens/Home/Home";
import RedirectScreen from "../RedirectScreen/RedirectScreen";
import MenuBar from "../MenuBar/MenuBar";
import ConfirmEmail from "../../screens/ConfirmEmail/ConfirmEmail";
import UneditableSong from "../../screens/UneditableSong/UnedtiableSong";
import { getUsername } from "../../util";
import * as selectedSongActions from "../../store/actions/selectedSongActions";
import * as authActions from "../../store/actions/authActions";
import * as songsActions from "../../store/actions/songsActions";
import PublicList from "../../screens/PublicList/PublicList";
import PasswordReset from "../../screens/PasswordReset/PasswordReset";
import PasswordChange from "../../screens/PasswordChange/PasswordChange";
import Profile from "../../screens/Profile/Profile";

export default function ThinRouter() {
	const [menuOpen, setMenuOpen] = useState(false);

	const menuClickHandler = () => {
		setMenuOpen((state) => !state);
	};

	const history = useHistory();
	const dispatch = useDispatch();

	// Every time the page is refreshed, reclaim redux state
	useEffect(() => {
		dispatch(songsActions.getPublicSongs());
		dispatch(songsActions.getUserSongs());
	}, [dispatch]);

	useEffect(() => {
		const updateRedux = () => {
			const URL = window.location.href.split("/");
			// E.g. ["http:", "", "localhost:3000", "#", "songs", "samliu12", "adele-hello"]
			if (URL.length === 7 && URL[4] === "songs") {
				dispatch(selectedSongActions.setIsSongPage(true));
				dispatch(selectedSongActions.setIsSongPageView(false));

				const songLink = URL[6];
				dispatch(selectedSongActions.setSongLink(songLink));
			} else if (
				URL.length === 8 &&
				URL[4] === "songs" &&
				URL[7] === "view"
			) {
				dispatch(selectedSongActions.setIsSongPageView(true));
				dispatch(selectedSongActions.setIsSongPage(false));

				const songLink = URL[6];
				dispatch(selectedSongActions.setSongLink(songLink));
			} else {
				dispatch(selectedSongActions.setIsSongPage(false));
				dispatch(selectedSongActions.setIsSongPageView(false));

				dispatch(selectedSongActions.setSongLink(null));
			}
		};

		const usernameHandler = () => {
			getUsername().then((response) => {
				const newUsername = !response ? null : response;

				dispatch(authActions.setUsername(newUsername));
			});
		};

		updateRedux();
		usernameHandler();

		const unlisten = history.listen(() => {
			updateRedux();
		});

		return () => unlisten();
	}, [dispatch, history]);

	return (
		<div>
			<CustomSidebar menuOpen={menuOpen} changeSidebar={menuClickHandler}>
				<MenuBar onMenuClick={menuClickHandler} />
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/help" component={Help} />
					<Route exact path="/user/:username" component={Profile} />
					<Route
						exact
						path={["/accounts/login", "/accounts/signup"]}
						component={Auth}
					/>
					<Route
						exact
						path="/accounts/unauthenticated"
						component={RedirectScreen}
					/>
					<Route
						exact
						path="/accounts/confirm-email"
						component={ConfirmEmail}
					/>
					<Route
						exact
						path="/accounts/password-reset"
						component={PasswordReset}
					/>
					<Route
						exact
						path="/accounts/password-change"
						component={PasswordChange}
					/>
					<Route exact path="/songs/public" component={PublicList} />
					<Route exact path="/songs/all" component={SongList} />
					<Route exact path="/songs/:username" component={SongList} />
					<Route
						exact
						path="/songs/:username/:song"
						component={Song}
					/>
					<Route
						exact
						path="/songs/:username/:song/view"
						component={UneditableSong}
					/>
					<Route component={ErrorScreen} />
				</Switch>
			</CustomSidebar>
		</div>
	);
}

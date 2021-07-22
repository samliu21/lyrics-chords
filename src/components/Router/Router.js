import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Route, Switch } from "react-router-dom";

import * as selectedSongActions from "../../store/actions/selectedSongActions";
import * as authActions from "../../store/actions/authActions";
import * as songsActions from "../../store/actions/songsActions";
import Auth from "../../screens/Auth/Auth";
import ConfirmEmail from "../../screens/ConfirmEmail/ConfirmEmail";
import CustomSidebar from "../CustomSideBar/CustomSidebar";
import ErrorScreen from "../Error/Error";
import { getUsername } from "../../util";
import Help from "../../screens/Help/Help";
import Home from "../../screens/Home/Home";
import MenuBar from "../MenuBar/MenuBar";
import NavBar from "../NavBar/NavBar";
import PublicList from "../../screens/PublicList/PublicList";
import PasswordReset from "../../screens/PasswordReset/PasswordReset";
import PasswordChange from "../../screens/PasswordChange/PasswordChange";
import Profile from "../../screens/Profile/Profile";
import SongList from "../../screens/SongList/SongList";
import Song from "../../screens/Song/Song";

export default function Router(props) {
	// For side menu bar in portrait mode
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

		const queryUsername = async () => {
			const username = await getUsername();

			dispatch(authActions.setUsername(username));
		};

		queryUsername();
	}, [dispatch]);

	// On router navigation, update song page redux states
	useEffect(() => {
		const updateRedux = () => {
			const URL = window.location.href.split("/");
			// E.g. ["http:", "", "localhost:3000", "#", "songs", 1, "adele-hello"]
			if (URL.length === 0 && URL[4] === "songs") {
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

		updateRedux();

		const unlisten = history.listen(() => {
			updateRedux();
		});

		return () => unlisten();
	}, [dispatch, history]);

	// Routes
	const Body = () => (
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
				path={["/songs/:username/:id", "/songs/:username/:id/view"]}
				component={Song}
			/>
			<Route component={ErrorScreen} />
		</Switch>
	);

	return props.horizontal ? (
		<div>
			<NavBar />
			<Body />
		</div>
	) : (
		<CustomSidebar menuOpen={menuOpen} changeSidebar={menuClickHandler}>
			<MenuBar onMenuClick={menuClickHandler} />
			<Body />
		</CustomSidebar>
	);
}

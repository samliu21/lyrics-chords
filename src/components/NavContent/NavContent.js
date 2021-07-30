import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import ui from "../../styles/ui.module.css";
import styles from "./NavContent.module.css";
import LogoutButton from "../LogoutButton/LogoutButton";
import Options from "../Options/Options";
import AutoScroll from "../AutoScroll/AutoScroll";

export default function NavContent(props) {
	const username = useSelector((state) => state.auth.username);
	const isSongPage = useSelector((state) => state.selectedSong.isSongPage);
	const isAdmin = useSelector((state) => state.auth.admin);
	const isSongPageView = useSelector(
		(state) => state.selectedSong.isSongPageView
	);

	// Prop direction-dependent styles
	const containerStyle =
		styles.container +
		" " +
		(props.direction === "row"
			? styles["container-horizontal"]
			: styles["container-vertical"]);

	const leftDivStyle =
		styles["left-div"] +
		" " +
		(props.direction === "row"
			? styles["left-div-horizontal"]
			: styles["left-div-vertical"]);

	const linkStyle =
		ui["nav-bar-link"] +
		" " +
		ui["nav-bar-hover"] +
		" " +
		(props.direction === "row"
			? styles["link-horizontal"]
			: styles["link-vertical"]);

	const loginStyle =
		ui["nav-bar-link"] +
		" " +
		(props.direction === "row"
			? styles["login-row"]
			: styles["login-column"]);

	let content = (
		<div className={containerStyle}>
			<div className={leftDivStyle}>
				{!username && (
					<Link to="/" className={linkStyle}>
						Home
					</Link>
				)}

				{/* Only show SongList if user is logged in  */}
				{username && (
					<Link to={`/songs/${username}`} className={linkStyle}>
						Song List
					</Link>
				)}

				<Link to="/songs/public" className={linkStyle}>
					Public
				</Link>

				{isAdmin && (
					<Link to="/songs/all" className={linkStyle}>
						Admin
					</Link>
				)}

				{props.direction === "row" && <Options />}

				{/* Only show autoscroll if horizontal nav bar and the user is on a song page */}
				{(isSongPage || isSongPageView) &&
					props.direction === "row" && <AutoScroll />}
			</div>

			<div>
				{username ? (
					<LogoutButton full={props.direction === "row"} />
				) : (
					<Link to="/accounts/login" className={loginStyle}>
						Login
					</Link>
				)}
			</div>
		</div>
	);

	return isSongPageView && props.direction === "row" ? (
		<div>
			{content}
			<div className={styles.view}>View Only Mode</div>
		</div>
	) : (
		content
	);
}

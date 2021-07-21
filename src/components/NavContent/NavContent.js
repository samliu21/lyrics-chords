import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { styles } from "./NavContentStyles";
import LogoutButton from "../LogoutButton/LogoutButton";
import DropDown from "../DropDown/DropDown";
import AutoScroll from "../AutoScroll/AutoScroll";

export default function NavContent(props) {
	const username = useSelector((state) => state.auth.username);
	const isSongPage = useSelector((state) => state.selectedSong.isSongPage);
	const isAdmin = useSelector((state) => state.auth.admin);
	const isSongPageView = useSelector(
		(state) => state.selectedSong.isSongPageView
	);

	// Prop direction-dependent styles
	const linkStyle = {
		...styles.link,
		width: props.direction === "column" ? "100%" : "auto",
	};

	const outerDivStyle = {
		...styles.container,
		flexDirection: props.direction,
		paddingBottom: props.direction === "column" ? 20 : 0,
	};

	const leftDivStyle = {
		...styles.leftContainer,
		flexDirection: props.direction,
		width: props.direction === "column" ? "100%" : "auto",
	};

	let content = (
		<div style={outerDivStyle}>
			<div style={leftDivStyle}>
				{!username &&
				(
					<Link
						to="/"
						className="navBarLink navBarHover"
						style={linkStyle}
					>
						Home
					</Link>
				)}

				{/* Only show SongList if user is logged in  */}
				{username && (
					<Link
						to={`/songs/${username}`}
						className="navBarLink navBarHover"
						style={linkStyle}
					>
						Song List
					</Link>
				)}

				<Link
					to="/songs/public"
					className="navBarLink navBarHover"
					style={linkStyle}
				>
					Public
				</Link>

				{isAdmin && (
					<Link
						to="/songs/all"
						className="navBarLink navBarHover"
						style={linkStyle}
					>
						Admin
					</Link>
				)}

				{/* Only show dropdown menu if horizontal nav bar */}
				{props.direction === "row" && <DropDown />}

				{/* Only show autoscroll if horizontal nav bar and the user is on a song page */}
				{(isSongPage || isSongPageView) &&
					props.direction === "row" && (
						<AutoScroll style={linkStyle} />
					)}
			</div>

			<div>
				{username ? (
					<LogoutButton full={props.direction === "row"} />
				) : (
					<Link
						to="/accounts/login"
						className="navBarLink"
						style={
							props.direction === "row"
								? styles.loginRow
								: styles.loginColumn
						}
					>
						Login
					</Link>
				)}
			</div>
		</div>
	);

	return isSongPageView && props.direction === "row" ? (
		<div>
			{content}
			<div style={styles.viewOnlyText}>View Only Mode</div>
		</div>
	) : (
		content
	);
}

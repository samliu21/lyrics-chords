import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "universal-cookie";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import * as authActions from "../../store/actions/authActions";
import { getToken, getUsername } from "../../util";
import { styles } from "./LogoutButtonStyles";
import LoadingCircle from "../LoadingCircle/LoadingCircle";

const cookie = new Cookie();

export default function LogoutButton(props) {
	const username = useSelector((state) => state.auth.username);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	const history = useHistory();
	const dispatch = useDispatch();

	const profileRedirectHandler = () => {
		history.push(`/user/${username}`);
	};

	useEffect(() => {
		if (!username) {
			getUsername();
		}
	}, [username]);

	const logoutHandler = async () => {
		cookie.remove("username");
		cookie.remove("email");
		cookie.remove("activated");

		setIsLoggingOut(true);
		try {
			await axios.post(
				"/api/auth/logout",
				{},
				{
					withCredentials: true,
					headers: {
						"X-CSRFToken": getToken(),
					},
				}
			);
			dispatch(authActions.setAdmin(null));
			dispatch(authActions.setUsername(null));

			history.push("/accounts/login");
		} catch (err) {
			alert("There was an error logging out.");
			setIsLoggingOut(false);
		}
	};

	// If horizontal navbar, show full text
	let content = (
		<div
			style={styles.rowContainer}
			onMouseEnter={() => setMenuOpen(true)}
			onMouseLeave={() => setMenuOpen(false)}
		>
			{isLoggingOut && <LoadingCircle />}

			<span
				onClick={profileRedirectHandler}
				style={styles.link}
				className="navBarLink navBarHover"
			>
				Welcome&nbsp;&nbsp;
				<span className="emphasis">{username}</span>
				.&nbsp;
			</span>

			<div style={styles.outerDiv}>
				{menuOpen && (
					<div
						style={styles.logout}
						onClick={logoutHandler}
						className="dropdown-option"
					>
						Logout here.
					</div>
				)}
			</div>
		</div>
	);

	// If sidebar, don't display full text
	if (!props.full) {
		content = (
			<div className="vertical" style={styles.columnContainer}>
				{isLoggingOut && <LoadingCircle />}
				<span
					className="emphasis pointer"
					style={styles.name}
					onClick={profileRedirectHandler}
				>
					{username}
				</span>
				<div>
					<span onClick={logoutHandler} className="navBarLink">
						Logout here.
					</span>
				</div>
			</div>
		);
	}

	return content;
}

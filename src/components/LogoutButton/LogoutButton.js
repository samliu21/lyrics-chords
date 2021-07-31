import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "universal-cookie";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import * as authActions from "../../store/actions/authActions";
import DropMenu from "../DropMenu/DropMenu";
import { getToken, getUsername } from "../../util";
import styles from "./LogoutButton.module.css";
import design from "../../styles/ui.module.css";
import LoadingCircle from "../LoadingCircle/LoadingCircle";
import ui from "../../styles/ui.module.css";

const cookie = new Cookie();

export default function LogoutButton(props) {
	const username = useSelector((state) => state.auth.username);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const history = useHistory();
	const dispatch = useDispatch();

	// Redirect to profile page
	const profileRedirectHandler = () => {
		history.push(`/user/${username}`);
	};

	// Get username
	useEffect(() => {
		if (!username) {
			getUsername();
		}
	}, [username]);

	// Remove values from cookies, dispatch to redux, and send to backend
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

	const items = [
		{
			text: <div>Logout here.</div>,
			onClick: () => logoutHandler(),
			condition: true,
		},
	];

	const welcome = () => (
		<div onClick={profileRedirectHandler}>
			Welcome&nbsp;&nbsp;
			<span className={ui.emphasis}>{username}</span>.
		</div>
	);

	// If horizontal navbar
	let content = <DropMenu title={welcome()} items={items} />;

	// If sidebar
	if (!props.full) {
		content = (
			<div className={styles.container}>
				<span
					className={`${design.emphasis} ${design.pointer} ${styles.name}`}
					onClick={profileRedirectHandler}
				>
					{username}
				</span>
				<span onClick={logoutHandler} className={design.pointer}>
					Logout here.
				</span>
			</div>
		);
	}

	return (
		<div>
			{isLoggingOut && <LoadingCircle />}
			{content}
		</div>
	);
}

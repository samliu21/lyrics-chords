import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import styles from "./Profile.module.css";
import layout from "../../styles/layout.module.css";
import ui from "../../styles/ui.module.css";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import axios from "axios";
import CapitalText from "../../components/CapitalText/CapitalText";

export default function Profile(props) {
	const username = props.match.params.username;
	const realUsername = useSelector((state) => state.auth.username);
	const [songCount, setSongCount] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const history = useHistory();

	useEffect(() => {
		const unlisten = history.listen(() => {
			setSongCount(null);
		});

		return () => unlisten();
	}, [history]);

	useEffect(() => {
		const getCount = async () => {
			const existingValue = localStorage.getItem(username);

			if (existingValue) {
				setSongCount(existingValue);
				return;
			}

			try {
				const response = await axios.get(
					`/api/songs/${username}/count/`,
					{
						username: username,
					}
				);

				const cnt = response.data;
				setSongCount(cnt);

				localStorage.setItem(username, cnt);
			} catch (err) {
				// User enters a username that doesn't exist
				if (err.response && err.response.data) {
					alert(err.response.data);
				} else {
					alert("There was an error loading the page.");
				}

				history.push(`/user/${realUsername}`);
			}
		};

		getCount();
	}, [username, history, realUsername]);

	const changePasswordHandler = async () => {
		setIsLoading(true);
		const response = await axios.get(
			"/api/auth/email/password-change-link"
		);
		const link = response.data;
		setIsLoading(false);

		history.push(link);
	};

	if (!songCount) {
		return <LoadingCircle />;
	}

	return (
		<div className={layout.container}>
			{isLoading && <LoadingCircle />}

			<div className={layout["horizontal-default"]}>
				<img
					src="https://hoursproject.com/cache/images/square_thumb/images/user/default.png"
					alt="profile-pic"
					className={styles.picture}
				/>
				<div>
					<h2 className={`${ui["plain-h2"]} ${ui.italic}`}>
						{username}
					</h2>
					<p>
						<span className={ui.italic}>Songsheets created:</span>
						&nbsp;&nbsp;
						{songCount}
					</p>
				</div>
			</div>
			{username === realUsername && (
				<CapitalText onClick={changePasswordHandler}>Change Password</CapitalText>
				
			)}
		</div>
	);
}

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { styles } from "./ProfileStyles";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import axios from "axios";

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
		<div style={styles.container}>
			{isLoading && <LoadingCircle />}

			<div style={styles.profile}>
				<img
					src="https://hoursproject.com/cache/images/square_thumb/images/user/default.png"
					alt="profile-pic"
					style={styles.picture}
				/>
				<div>
					<h2 style={styles.name} className="italic">
						{username}
					</h2>
					<p>
						<span className="italic">Songsheets created:</span>
						&nbsp;&nbsp;
						{songCount}
					</p>
				</div>
			</div>
			{username === realUsername && (
				<p className="important" onClick={changePasswordHandler}>
					CHANGE PASSWORD
				</p>
			)}
		</div>
	);
}

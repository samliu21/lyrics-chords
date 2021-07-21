import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import { styles } from "./ProfileStyles";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import axios from "axios";
import { getUsername } from "../../util";

export default function Profile(props) {
	const username = props.match.params.username;
	const [songCount, setSongCount] = useState();

	const history = useHistory();

	useEffect(() => {
		const unlisten = history.listen(() => {
			setSongCount(null);
		});

		return () => unlisten();
	}, [history]);

	useEffect(() => {
		const getCount = async () => {
			const userUsername = await getUsername();

			if (username === userUsername) {
				const existingValue = localStorage.getItem(username);

				if (existingValue) {
					setSongCount(existingValue);
					return;
				}
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
				if (err.response && err.response.data) {
					alert(err.response.data);
				} else {
					alert("There was an error loading the page.");
				}

				history.push(`/user/${userUsername}`);
			}
		};

		getCount();
	}, [username, history]);

	if (!songCount) {
		return <LoadingCircle />;
	}

	return (
		<div style={styles.container}>
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
	);
}

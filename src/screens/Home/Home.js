import React from "react";
import { useHistory } from "react-router";

import { styles } from "./HomeStyles";

export default function Home() {
	const history = useHistory();

	const loginHandler = () => {
		history.push("/accounts/login");
	};

	const publicHandler = () => {
		history.push("/songs/public");
	};

	const helpHandler = () => {
		history.push("/help");
	};

	return (
		<div style={styles.container}>
			<h3 style={styles.text}>
				Hi, I'm <span className="emphasis">Sam</span> and welcome to my
				website!
			</h3>
			<h3
				style={styles.loginText}
				className="emphasis pointer"
				onClick={loginHandler}
			>
				LOGIN/SIGNUP
			</h3>
			<p style={styles.content}>
				As a fervent guitarist, I've discovered the need for
				customizable songsheets to store lyrics, chords, and strumming
				patterns, and so, I made this website to do exactly that!&nbsp;
			</p>
			<p style={styles.content}>
				Start by logging in or signing up in the top right corner or
				clicking the&nbsp;
				<span className="emphasis pointer" onClick={publicHandler}>
					Public
				</span>
				&nbsp; tab in the navigation bar to look at other people's
				public song sheets!
			</p>
			<p style={styles.content}>
				Feel free to checkout the&nbsp;
				<span className="emphasis pointer" onClick={helpHandler}>
					Help
				</span>
				&nbsp; page if you ever need a hand or want to see the full
				potential of this website!
			</p>
		</div>
	);
}

import React from "react";
import { useHistory } from "react-router";

import layout from "../../styles/layout.module.css";
import ui from "../../styles/ui.module.css";

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
		<div className={layout.container}>
			<h3 className={ui["plain-h2"]}>
				Hi, I'm <span className={ui.emphasis}>Sam</span> and welcome to
				my website!
			</h3>
			<h3
				className={`${ui["plain-h2"]} ${ui.emphasis} ${ui.pointer}`}
				onClick={loginHandler}
			>
				LOGIN/SIGNUP
			</h3>
			<p className={ui["plain-h3"]}>
				As a fervent guitarist, I've discovered the need for
				customizable songsheets to store lyrics, chords, and strumming
				patterns, and so, I made this website to do exactly that!&nbsp;
			</p>
			<p className={ui["plain-h3"]}>
				Start by logging in or signing up in the top right corner or
				clicking the&nbsp;
				<span
					className={`${ui.emphasis} ${ui.pointer}`}
					onClick={publicHandler}
				>
					Public
				</span>
				&nbsp;tab in the navigation bar to look at other people's public
				song sheets!
			</p>
			<p className={ui["plain-h3"]}>
				Feel free to checkout the&nbsp;
				<span
					className={`${ui.emphasis} ${ui.pointer}`}
					onClick={helpHandler}
				>
					Help
				</span>
				&nbsp;page if you ever need a hand or want to see the full
				potential of this website!
			</p>
		</div>
	);
}

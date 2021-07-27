import React from "react";

import { styles } from "./CommentsBlockStyles";

export default function CommentsBlock(props) {
	const { username, contents, date } = props;

	const dateConverter = () => {
		const dateOfCreation = new Date(date);
		const currentDate = new Date();
		const msDif = currentDate - dateOfCreation; // Time elapsed in milliseconds

		if (dateOfCreation.getDate() === currentDate.getDate()) {
			// Same day
			const hourDif = msDif / 3600000;
			if (hourDif < 1) {
				// Show minutes ago
				const minuteDif = Math.round(hourDif * 60);
				return `${minuteDif} minutes ago`;
			} else {
				// Show hours ago
				return `${Math.round(hourDif)} hours ago`;
			}
		}

		const dayDif = Math.round(msDif / 3600000 / 24);
		if (dayDif <= 30) {
			return `${dayDif} days ago`;
		}

		const monthDif = Math.round(dayDif / 30);
		if (monthDif <= 12) {
			return `${monthDif} months ago`;
		}

		else {
			return `on ${dateOfCreation.getFullYear()}/${dateOfCreation.getMonth()}/${dateOfCreation.getDate()}`
		}
	};

	dateConverter();

	return (
		<div style={styles.container}>
			<div style={styles.horizontalContainer}>
				<p style={styles.username}>{username}</p>
				<p>&nbsp; commented {dateConverter()}</p>
			</div>
			<p>{contents}</p>
		</div>
	);
}

import React from "react";
import { useHistory } from "react-router";

import { styles } from "./UneditableSongBlockStyles";
import { turnIntoLink } from "../../util";

export default function UneditableSongBlock(props) {
	const history = useHistory();

	const path = history.location.pathname.split("/");
	const location = path[path.length - 1];

	// Redirect on arrow click
	const redirectHandler = async () => {
		const link = turnIntoLink(props.item.artist, props.item.name);
		history.push(`/songs/${props.item.creator}/${link}/view`);
	};

	return (
		<div style={styles.songContainer}>
			<div style={styles.horizontal}>
				<div>
					<h2 style={styles.name}>{props.item.name}</h2>
					<p style={styles.artist}>{props.item.artist}</p>
					<div className="italic" style={styles.creator}>
						Created by&nbsp;
						<span style={styles.creatorName}>
							{props.item.creator}
						</span>
						.
					</div>
				</div>
			</div>
			<div style={styles.imageContainer} onClick={redirectHandler}>
				<img
					src="https://i.pinimg.com/originals/58/1d/34/581d34b9daddc9f6eec84accc93c7a0c.png"
					style={styles.arrow}
					alt="Arrow"
				/>
				{location === "public" && (
					<p style={styles.views}>
						{props.item.views.split("**").length - 1}
					</p>
				)}
			</div>
		</div>
	);
}

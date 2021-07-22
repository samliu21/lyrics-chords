import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

import { styles } from "./UneditableSongBlockStyles";
import { turnIntoLink } from "../../util";

export default function UneditableSongBlock(props) {
	const [views, setViews] = useState();

	const history = useHistory();

	const path = history.location.pathname.split("/");
	const location = path[path.length - 1];

	useEffect(() => {
		const getViews = async () => {
			try {
				const response = await axios.get(
					`/api/views/get_views/${props.item.id}`
				);
				setViews(response.data);
			} catch (err) {
				console.log(err.message);
			}
		};

		if (!views) {
			getViews();
		}
	}, [views, props.item.id]);

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
				{location === "public" && views !== null && (
					<p style={styles.views}>
						{views}
					</p>
				)}
			</div>
		</div>
	);
}

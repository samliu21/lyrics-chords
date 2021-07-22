import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../store/actions/songsActions";
import { useHistory } from "react-router";

import EditableComponent from "../EditableComponent/EditableComponent";
import { styles } from "./SongBlockStyles";
import {
	getUsername,
	turnIntoLink,
	updateSongAttributeToDatabase,
} from "../../util";
import {
	AiOutlineEye,
	AiOutlineEyeInvisible,
	AiOutlineStar,
	AiFillStar,
} from "react-icons/ai";
import { BsTrashFill } from "react-icons/bs";
import axios from "axios";

export default function SongBlock(props) {
	const dispatch = useDispatch();
	const history = useHistory();

	const [views, setViews] = useState();

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

	// Delete song request
	function deleteHandler() {
		try {
			dispatch(actions.deleteSong(props.item.id));

			getUsername().then((username) => {
				localStorage.removeItem(username);
			});
		} catch (err) {
			alert("There was an error deleting the song");
		}
	}

	// Redirect on arrow click
	const redirectHandler = async () => {
		const link = turnIntoLink(props.item.artist, props.item.name);
		history.push(`/songs/${props.item.creator}/${link}`);
	};

	// Public handler
	const publicHandler = () => {
		updateSongAttributeToDatabase(
			props.item.id,
			"public",
			!props.item.public
		);

		dispatch(
			actions.updateSong(props.item.id, "public", !props.item.public)
		);
	};

	// Favourite handler
	const favouriteHandler = () => {
		updateSongAttributeToDatabase(
			props.item.id,
			"is_favourite",
			!props.item.is_favourite
		);

		dispatch(
			actions.updateSong(
				props.item.id,
				"is_favourite",
				!props.item.is_favourite
			)
		);
	};

	return (
		<div style={styles.songContainer}>
			<div style={styles.horizontal}>
				<div className="vertical" style={styles.buttonContainer}>
					{props.item.is_favourite ? (
						<AiFillStar
							onClick={favouriteHandler}
							style={styles.star}
						/>
					) : (
						<AiOutlineStar
							onClick={favouriteHandler}
							style={styles.star}
						/>
					)}
					{props.item.public ? (
						<AiOutlineEye
							onClick={publicHandler}
							style={styles.eye}
						/>
					) : (
						<AiOutlineEyeInvisible
							onClick={publicHandler}
							style={styles.eye}
						/>
					)}
					<BsTrashFill
						style={styles.trashCan}
						onClick={deleteHandler}
					/>
				</div>
				<div>
					<EditableComponent
						title="name"
						style={styles.name}
						item={props.item}
						content={props.item.name}
						tag="h2"
					/>
					<EditableComponent
						title="artist"
						style={styles.artist}
						item={props.item}
						content={props.item.artist}
						tag="p"
					/>
					{props.public && (
						<div className="italic" style={styles.creator}>
							Created by&nbsp;
							<span style={styles.creatorName}>
								{props.item.creator}
							</span>
							.
						</div>
					)}
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

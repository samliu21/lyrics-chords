import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import * as actions from "../../store/actions/songsActions";
import {
	AiOutlineEye,
	AiOutlineEyeInvisible,
	AiOutlineStar,
	AiFillStar,
} from "react-icons/ai";
import { BsTrashFill } from "react-icons/bs";
import EditableComponent from "../EditableComponent/EditableComponent";
import {
	getUsername,
	turnIntoLink,
	updateSongAttributeToDatabase,
} from "../../util";
import { styles } from "./SongBlockStyles";

export default function SongBlock(props) {
	const dispatch = useDispatch();
	const history = useHistory();

	const path = history.location.pathname.split("/");
	const location = path[path.length - 1];

	// Delete song
	function deleteHandler() {
		try {
			dispatch(actions.deleteSong(props.item.id));

			// Reset localStorage element containing the number of songsheets to display in the profile page
			getUsername().then((username) => {
				localStorage.removeItem(username);
			});
		} catch (err) {
			alert("There was an error deleting the song");
		}
	}

	// Go to song page handler
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

		// Default the value to 0
		dispatch(actions.incrementView(props.item.id));
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

	// Star (favourite)
	const Star = (starProps) =>
		props.item.is_favourite ? (
			<AiFillStar {...starProps} />
		) : (
			<AiOutlineStar {...starProps} />
		);

	// Eye (public)
	const Eye = (eyeProps) =>
		props.item.public ? (
			<AiOutlineEye {...eyeProps} />
		) : (
			<AiOutlineEyeInvisible {...eyeProps} />
		);

	return (
		<div style={styles.songContainer}>
			{/* Left part of container  */}
			<div style={styles.horizontal}>
				{/* Control bar  */}
				<div className="vertical" style={styles.buttonContainer}>
					<Star onClick={favouriteHandler} style={styles.star} />
					<Eye onClick={publicHandler} style={styles.eye} />
					<BsTrashFill
						onClick={deleteHandler}
						style={styles.trashCan}
					/>
				</div>

				<div>
					{/* Title and artist  */}
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

					{/* Created by  */}
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

			{/* Right side of container  */}
			<div style={styles.imageContainer} onClick={redirectHandler}>
				<img
					src="https://i.pinimg.com/originals/58/1d/34/581d34b9daddc9f6eec84accc93c7a0c.png"
					alt="Arrow"
					style={styles.arrow}
				/>
				{location === "public" && props.views !== null && (
					<p style={styles.views}>{props.views}</p>
				)}
			</div>
		</div>
	);
}

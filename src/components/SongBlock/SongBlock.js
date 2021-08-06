import React, { createRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import * as songsActions from "../../store/actions/songsActions";
import {
	AiOutlineEye,
	AiOutlineEyeInvisible,
	AiOutlineStar,
	AiFillStar,
} from "react-icons/ai";
import { BsTrashFill } from "react-icons/bs";
import { getUsername, updateSongAttributeToDatabase } from "../../util";
import layout from "../../styles/layout.module.css";
import styles from "./SongBlock.module.css";

export default function SongBlock(props) {
	const dispatch = useDispatch();
	const history = useHistory();

	const path = history.location.pathname.split("/");
	const location = path[path.length - 1];

	const nameRef = createRef();
	const artistRef = createRef();

	// Delete song
	async function deleteHandler() {
		try {
			dispatch(songsActions.deleteSong(props.item.id));

			// Reset localStorage element containing the number of songsheets to display in the profile page
			const username = await getUsername();
			localStorage.removeItem(username);
		} catch (err) {
			alert("There was an error deleting the song");
		}
	}

	// Go to song page handler
	const redirectHandler = async () => {
		if (props.item.artist === "" || props.item.name === "") {
			alert("Please enter a song name and artist before proceeding!");
			return;
		}
		history.push(
			props.editable
				? `/songs/${props.item.creator}/${props.item.id}`
				: `/songs/${props.item.creator}/${props.item.id}/view`
		);
	};

	// Public handler
	const publicHandler = () => {
		if (props.item.artist === "" || props.item.name === "") {
			alert("Please enter a song name and artist before publicizing!");
			return;
		}

		updateSongAttributeToDatabase(
			props.item.id,
			"public",
			!props.item.public
		);

		dispatch(
			songsActions.updateSong(props.item.id, "public", !props.item.public)
		);

		// Default the value to 0
		dispatch(songsActions.incrementView(props.item.id));
	};

	// Favourite handler
	const favouriteHandler = () => {
		updateSongAttributeToDatabase(
			props.item.id,
			"is_favourite",
			!props.item.is_favourite
		);

		dispatch(
			songsActions.updateSong(
				props.item.id,
				"is_favourite",
				!props.item.is_favourite
			)
		);
	};

	// On title or artist blur
	const inputBlur = () => {
		const name = nameRef.current.value;
		const artist = artistRef.current.value;

		const id = props.item.id;

		// If nothing changed, don't make database call
		if (props.item.name === name && props.item.artist === artist) {
			return;
		}
		const choice = name !== props.item.name ? "name" : "artist";
		const val = name !== props.item.name ? name : artist;

		dispatch(songsActions.updateSong(id, choice, val));
		updateSongAttributeToDatabase(id, choice, val);
	};

	// Enter causes blur
	const preventEnterHandler = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			event.target.blur();
		}
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

	const inputKwargs = props.editable ? {} : { readOnly: true };

	return (
		<div className={styles["song-container"]}>
			{/* Left part of container  */}
			<div className={layout["horizontal-default"]}>
				{/* Control bar  */}
				{props.editable && (
					<div
						className={styles["button-container"]}
					>
						<Star onClick={favouriteHandler} />
						<Eye onClick={publicHandler} className={styles.eye} />
						<BsTrashFill onClick={deleteHandler} />
					</div>
				)}

				<div className={layout["vertical-default"]}>
					{/* Title and artist  */}
					<input
						className={styles.name}
						defaultValue={props.item.name}
						placeholder="Enter a song name"
						onBlur={inputBlur}
						onKeyDown={preventEnterHandler}
						ref={nameRef}
						{...inputKwargs}
					/>
					<input
						className={styles.artist}
						defaultValue={props.item.artist}
						placeholder="Enter an artist"
						onBlur={inputBlur}
						onKeyDown={preventEnterHandler}
						ref={artistRef}
						{...inputKwargs}
					/>

					{/* Created by */}
					{props.public && (
						<div className={styles.creator}>
							Created by&nbsp;
							<span className={styles["creator-name"]}>
								{props.item.creator}
							</span>
							.
						</div>
					)}
				</div>
			</div>

			{/* Right side of container  */}
			<div
				className={styles["image-container"]}
				onClick={redirectHandler}
			>
				<img
					src="https://i.pinimg.com/originals/58/1d/34/581d34b9daddc9f6eec84accc93c7a0c.png"
					alt="Arrow"
					className={styles.arrow}
				/>
				{location === "public" && props.views !== null && (
					<p className={styles.views}>{props.views}</p>
				)}
			</div>
		</div>
	);
}

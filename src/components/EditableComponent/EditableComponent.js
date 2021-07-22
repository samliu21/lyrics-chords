import React from "react";
import { useDispatch } from "react-redux";
import * as songActions from "../../store/actions/songsActions";
import { useHistory } from "react-router";

import {
	turnIntoLink,
	updateSongAttributeToDatabase,
} from "../../util";

export default function EditableComponent(props) {
	const dispatch = useDispatch();
	const history = useHistory();

	// Enter causes blur
	const preventEnterHandler = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			event.target.blur();
		}
	};

	// Update song request
	async function textBlurHandler(event) {
		const val = event.target.textContent;

		const id = props.item.id;
		const choice = props.title;

		const newName = choice === "name" ? val : props.item.name;
		const newArtist = choice === "artist" ? val : props.item.artist;

		// If nothing changed, don't make database call
		if (props.item.name === newName && props.item.artist === newArtist) {
			return;
		}

		dispatch(songActions.updateSong(id, choice, val));
		updateSongAttributeToDatabase(id, choice, val);

		// Title and artist of Song page
		if (props.switchedNameHandler) {
			const newLink = `/songs/${props.item.creator}/${turnIntoLink(newArtist, newName)}`;

			props.switchedNameHandler();
			history.replace(newLink);
		}
	}

	const Tag = props.tag;
	const { style } = props;

	return (
		<Tag
			style={style}
			className="preventEnter"
			contentEditable={true}
			suppressContentEditableWarning={true}
			onBlur={textBlurHandler}
			onKeyDown={preventEnterHandler}
		>
			{props.content}
		</Tag>
	);
}

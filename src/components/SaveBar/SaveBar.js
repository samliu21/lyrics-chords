import React, { useState, useRef, useEffect } from "react";

import { styles } from "./SaveBarStyles";
import { AiOutlineSave } from "react-icons/ai";
import { updateSongAttributeToDatabase, updateSongToDatabase } from "../../util";

export default function SaveBar(props) {
	const [open, setOpen] = useState(false);
	const closeSidebarTimer = useRef();

	useEffect(() => {
		return () => {
			clearInterval(closeSidebarTimer.current);
		};
	}, []);

	// Click save handler
	const saveHandler = () => {
		setOpen(true);

		clearInterval(closeSidebarTimer.current);
		closeSidebarTimer.current = setInterval(() => {
			setOpen(false);
			clearInterval(closeSidebarTimer.current); 
		}, 2000);

		// Save to database through util function
		console.log(props.chords);
		// updateSongToDatabase(props.item);

		props.onSave();
	};

	return (
		<div style={styles.container} onClick={saveHandler}>
			{open && <p style={styles.text}>Saved!</p>}
			<AiOutlineSave style={styles.save} />
		</div>
	);
}

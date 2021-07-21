import React from "react";
import { styles } from "./InfoBarStyles";

export default function InfoBar(props) {
	const len = props.selectedSong.views.split("**").length - 1;
	return (
		<p style={styles.text}>
			{props.selectedSong.creator}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
			{len}&nbsp;
			{len === 1 ? "view" : "views"}
		</p>
	);
}

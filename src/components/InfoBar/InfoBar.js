import React from "react";
import { styles } from "./InfoBarStyles";

export default function InfoBar(props) {
	return (
		<p style={styles.text}>
			{props.selectedSong.creator}&nbsp;&nbsp;&nbsp;|
		</p>
	);
}

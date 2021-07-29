import React from "react";

import styles from "./CapitalText.module.css";

export default function CapitalText(props) {
	return (
		<p {...props} className={styles.text}>
			{props.children.toUpperCase()}
		</p>
	);
}

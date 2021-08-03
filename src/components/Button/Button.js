import React from "react";

import styles from "./Button.css";

export default function Button(props) {
	const { className } = props;

	return (
		<button onClick={props.onClick} className={`${styles.btn} ${className}`}>
			{props.children}
		</button>
	);
}

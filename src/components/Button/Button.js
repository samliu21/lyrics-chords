import React from "react";

import styles from "./Button.module.css";

export default function Button(props) {
	const { style } = props;

	return (
		<button onClick={props.onClick} style={style} className={styles.btn}>
			{props.children}
		</button>
	);
}

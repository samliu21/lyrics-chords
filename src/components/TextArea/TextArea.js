import React from "react";

import styles from "./TextArea.module.css";

export default function TextArea(props) {
	return (
		<div>
			<hr />
			<textarea
				rows={4}
				className={styles.input}
				maxLength={500}
				defaultValue={props.defaultValue ?? ""}
				ref={props.refName}
			/>
			<hr />
		</div>
	);
}

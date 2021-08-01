import React from "react";

import styles from "./TextArea.module.css";

export default function TextArea(props) {
	return (
		<div>
			{!props.noLines && <hr />}
			<textarea
				rows={props.lineCount ?? 4}
				className={styles.input}
				maxLength={500}
				defaultValue={props.defaultValue ?? ""}
				ref={props.refName}
			/>
			{!props.noLines && <hr />}
		</div>
	);
}

import React from "react";

import { styles } from "./TextAreaStyles";

export default function TextArea(props) {
	return (
		<div>
			<hr />
			<textarea
				rows={4}
				style={styles.input}
				maxLength={500}
				defaultValue={props.defaultValue ?? ""}
				ref={props.refName}
			/>
			<hr />
		</div>
	);
}

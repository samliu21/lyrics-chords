import React from "react";
import TextArea from "../TextArea/TextArea";

import { styles } from "./NewCommentStyles";

export default function NewComment(props) {
	return (
		<div style={props.border ? styles.container : {}}>
			{props.title && <h3 style={styles.heading}>{props.title}</h3>}
			<TextArea
				refName={props.refName}
				defaultValue={props.defaultValue}
			/>
			{props.cancelHandler ? (
				<div className="horizontal-between">
					<button onClick={props.cancelHandler} style={styles.button}>
						Cancel
					</button>
					<button onClick={props.submitHandler} style={styles.button}>
						Submit
					</button>
				</div>
			) : (
				<button
					onClick={props.submitHandler}
					style={{ ...styles.button, ...styles.alignRight }}
				>
					Submit
				</button>
			)}
		</div>
	);
}

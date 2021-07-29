import React from "react";
import Button from "../Button/Button";
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
					<Button onClick={props.cancelHandler}>Cancel</Button>
					<Button onClick={props.submitHandler}>Submit</Button>
				</div>
			) : (
				<Button onClick={props.submitHandler} style={styles.alignRight}>Submit</Button>
				// <button
				// 	onClick={props.submitHandler}
				// 	style={{ ...styles.button, ...styles.alignRight }}
				// >
				// 	Submit
				// </button>
			)}
		</div>
	);
}

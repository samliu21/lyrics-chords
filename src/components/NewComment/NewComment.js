import React from "react";
import Button from "../Button/Button";
import TextArea from "../TextArea/TextArea";

import styles from "./NewComment.module.css";
import layout from "../../styles/layout.module.css";

export default function NewComment(props) {
	return (
		<div className={props.border ? styles.container : ""}>
			{props.title && <h3 className={styles.heading}>{props.title}</h3>}
			<TextArea
				refName={props.refName}
				defaultValue={props.defaultValue}
			/>
			{props.cancelHandler ? (
				<div className={layout["horizontal-between"]}>
					<Button onClick={props.cancelHandler}>Cancel</Button>
					<Button onClick={props.submitHandler}>Submit</Button>
				</div>
			) : (
				<Button
					onClick={props.submitHandler}
					className={layout["align-block-right"]}
				>
					Submit
				</Button>
			)}
		</div>
	);
}

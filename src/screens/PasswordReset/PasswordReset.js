import axios from "axios";
import React, { createRef } from "react";
import { getToken } from "../../util";

import styles from "./PasswordReset.module.css";
import layout from "../../styles/layout.module.css";
import ui from "../../styles/ui.module.css";
import Button from "../../components/Button/Button";

export default function PasswordReset() {
	const input = createRef();

	// Reset password handler
	const resetHandler = async () => {
		const email = input.current.value;

		try {
			const response = await axios.post(
				"/api/auth/email/password-reset",
				{
					email: email,
				},
				{
					headers: {
						"Content-Type": "application/json",
						"X-CSRFToken": getToken(),
					},
				}
			);

			alert(response.data);
		} catch (err) {
			alert(err.response.data ?? "There was an error sending the email.");
		}
	};

	return (
		<div className={layout.container}>
			<h2 className={ui.title}>Password Reset</h2>
			<p className={ui.italic}>
				Forgotten your password? Enter your email address below, and
				we'll email instructions for setting a new one.
			</p>
			<div className={layout["horizontal-default"]}>
				<p className={styles.text}>Email address:</p>
				<input ref={input} className={ui["purple-input"]} />
			</div>
			<Button onClick={resetHandler} className={styles.button}>
				Reset my password!
			</Button>
		</div>
	);
}

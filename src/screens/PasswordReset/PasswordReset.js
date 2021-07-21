import axios from "axios";
import React, { createRef } from "react";
import { getToken } from "../../util";

import { styles } from "./PasswordResetStyles";

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
		<div style={styles.container}>
			<h2 style={styles.heading}>Password Reset</h2>
			<p className="italic">
				Forgotten your password? Enter your email address below, and
				we'll email instructions for setting a new one.
			</p>
			<div style={styles.emailContainer}>
				<p style={styles.emailLabel}>Email address:</p>
				<input ref={input} style={styles.input} />
			</div>
			<button style={styles.button} onClick={resetHandler}>
				Reset my password!
			</button>
		</div>
	);
}

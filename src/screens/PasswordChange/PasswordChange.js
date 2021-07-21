import axios from "axios";
import React, { createRef } from "react";
import { getToken } from "../../util";
import { useHistory } from "react-router";

import { styles } from "./PasswordChangeStyles";

export default function PasswordChange(props) {
	const password = createRef();
	const retypedPassword = createRef();

	const history = useHistory();

	const changePasswordHandler = async () => {
		const params = props.match.params;
		const uid = params.uid;
		const token = params.token;

		const pswd = password.current.value;
		const retypedPswd = retypedPassword.current.value;
		if (pswd !== retypedPswd) {
			alert("Passwords don't match!");
			return;
		}

		try {
			const response = await axios.post(
				"/api/auth/email/change-password",
				{
					uid: uid,
					token: token,
					password: pswd,
				},
				{
					headers: {
						"Content-Type": "application/json",
						"X-CSRFToken": getToken(),
					},
				}
			);

			alert(response.data);

			history.push("/accounts/login");
		} catch (err) {
			console.log(err.response);
			alert(
				err.response.data ??
					"There was an error resetting your password."
			);
		}
	};

	return (
		<div style={styles.container}>
			<h2 style={styles.heading}>Password Change</h2>
			<div style={styles.horizontal}>
				<p style={styles.text}>Password:</p>
				<input style={styles.input} ref={password} type="password" />
			</div>
			<div style={styles.horizontal}>
				<p style={styles.text}>Retype Password:</p>
				<input
					style={styles.input}
					ref={retypedPassword}
					type="password"
				/>
			</div>
			<button style={styles.button} onClick={changePasswordHandler}>
				Submit
			</button>
		</div>
	);
}

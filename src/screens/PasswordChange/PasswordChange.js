import axios from "axios";
import React, { createRef } from "react";
import { getToken } from "../../util";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";

import styles from "./PasswordChange.module.css";
import * as authActions from "../../store/actions/authActions";
import layout from "../../styles/layout.module.css";
import ui from "../../styles/ui.module.css";
import Button from "../../components/Button/Button";

export default function PasswordChange(props) {
	const password = createRef();
	const retypedPassword = createRef();

	const history = useHistory();
	const dispatch = useDispatch();

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
				"/api/auth/email/password-change",
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
			dispatch(authActions.setAdmin(null));
			dispatch(authActions.setUsername(null));

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
		<div className={layout.container}>
			<h2 className={ui.title}>Password Change</h2>
			<div className={layout["horizontal-default"]}>
				<p className={styles.text}>Password:</p>
				<input
					className={ui["purple-input"]}
					ref={password}
					type="password"
				/>
			</div>
			<div className={layout["horizontal-default"]}>
				<p className={styles.text}>Retype Password:</p>
				<input
					className={ui["purple-input"]}
					ref={retypedPassword}
					type="password"
				/>
			</div>
			<Button onClick={changePasswordHandler} className={styles.button}>
				Submit
			</Button>
		</div>
	);
}

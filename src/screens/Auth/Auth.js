import axios from "axios";
import React, { useState } from "react";
import Cookie from "universal-cookie";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import * as authActions from "../../store/actions/authActions";
import * as songsActions from "../../store/actions/songsActions";
import { getToken, getActivationStatus } from "../../util";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import Button from "../../components/Button/Button";
import layout from "../../styles/layout.module.css";
import ui from "../../styles/ui.module.css";
import styles from "./Auth.module.css";

const cookie = new Cookie();

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export default function Auth() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatedPassword, setRepeatedPassword] = useState("");
	const [login, setLogin] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();
	const history = useHistory();

	// Forgot password handler
	const forgotPasswordHandler = () => {
		history.push("/accounts/password-reset");
	};

	// On switch between login and sign up
	const switchModeHandler = () => {
		setLogin((state) => !state);

		if (login && username.indexOf("@") > -1) {
			setEmail(username);
			setUsername("");
		} else if (!login && !username && email) {
			setUsername(email);
		}

		history.replace(login ? "/accounts/signup" : "/accounts/login");
	};

	// Submit handler (login or sign up)
	async function submitHandler(event) {
		await axios.get("/api/auth/csrf", {
			withCredentials: true,
		});

		event.preventDefault();
		const state = login ? "login" : "signup";

		// Check that passwords match
		if (state === "signup" && repeatedPassword !== password) {
			alert("Your passwords don't match. Please try again.");
			return;
		}

		// Check that email is not blank (since this is not built into SQL)
		if (state === "signup" && email.indexOf("@") === -1) {
			alert("Invalid email address. Please try again.");
			return;
		}

		// Check that username is not a keyword
		const keywordList = ["accounts", "songs", "help", "user"];
		if (keywordList.indexOf(username) > -1) {
			alert("The given username cannot be used. Please try again.");
			return;
		}

		try {
			setIsLoading(true);
			const response =
				state === "signup"
					? await axios.post(
							`/api/auth/${state}`,
							{
								username: username,
								email: email,
								password: password,
							},
							{
								withCredentials: true,
								headers: {
									"X-CSRFToken": getToken(),
								},
							}
					  )
					: await axios.post(
							`/api/auth/${state}`,
							{
								username: username,
								password: password,
							},
							{
								withCredentials: true,
								headers: {
									"X-CSRFToken": getToken(),
								},
							}
					  );
			// Login successful or signup successful respectively; set username
			const [queriedUsername, queriedEmail, queriedAdmin] =
				response.data.split("**");

			const queriedActivated = await getActivationStatus(true);

			cookie.set("username", queriedUsername, { path: "/" });
			cookie.set("email", queriedEmail, { path: "/" });
			cookie.set("activated", queriedActivated, { path: "/" });

			dispatch(authActions.setUsername(queriedUsername));
			dispatch(authActions.setAdmin(queriedAdmin));

			// Get the new user's songs
			dispatch(songsActions.getUserSongs());
			setIsLoading(false);
			console.log(login);

			if (login) {
				history.push(`/songs/${queriedUsername}`);
			} else {
				history.push("/accounts/confirm-email");
			}
		} catch (err) {
			setIsLoading(false);
			let message = "There was an error handling your credentials.";
			if (err.response && err.response.data) {
				message = err.response.data;
			}
			alert(message);
		}
	}

	return (
		<div className={layout.container}>
			{isLoading && <LoadingCircle />}

			<div>
				<h1 className={ui.header}>{login ? "Login" : "Sign Up"}</h1>
				<form>
					{/* Username */}
					<label className={styles.label} htmlFor="username">
						{login ? "Username/Email" : "Username"}
					</label>
					<br />
					<input
						id="username"
						className={styles.field}
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<br />

					{!login && (
						<div>
							<label className={styles.label} htmlFor="email">
								Email
							</label>
							<br />
							<input
								id="email"
								className={styles.field}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<br />
						</div>
					)}

					{/* Password */}
					<label className={styles.label} htmlFor="password">
						Password
					</label>
					<br />
					<input
						type="password"
						id="password"
						className={styles.field}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<br />

					{/* Repeated password */}
					{!login && (
						<div>
							<label
								className={styles.label}
								htmlFor="repeated-password"
							>
								Re-enter your password
							</label>
							<br />
							<input
								type="password"
								id="repeated-password"
								className={styles.field}
								value={repeatedPassword}
								onChange={(e) =>
									setRepeatedPassword(e.target.value)
								}
							/>
							<br />
						</div>
					)}

					{/* Buttons */}
					<div className={styles["button-container"]}>
						<Button onClick={submitHandler}>Submit</Button>
						<Button onClick={switchModeHandler}>
							Switch to {login ? "Sign up" : "Login"}
						</Button>
					</div>

					{login && (
						<p
							className={ui["small-text"]}
							onClick={forgotPasswordHandler}
						>
							Forgot your password?
						</p>
					)}
				</form>
			</div>
		</div>
	);
}

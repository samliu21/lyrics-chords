import axios from "axios";
import React, { useState } from "react";
import Cookie from "universal-cookie";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { styles } from "./AuthStyles";
import { getToken, getActivationStatus } from "../../util";
import * as authActions from "../../store/actions/authActions";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";

const cookie = new Cookie();

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
		}

		history.replace(login ? "/accounts/signup" : "/accounts/login");
	};

	// Submit handler (login or sign up)
	async function submitHandler(event) {
		axios
			.get("/api/auth/csrf", {
				withCredentials: true,
			})
			.catch(() =>
				alert(
					"There was an error getting your CSRF token. Please report this to me at sam4button@gmail.com."
				)
			);

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
			const [queriedUsername, queriedEmail, queriedAdmin] = response.data.split("**");

			const queriedActivated = await getActivationStatus(true);

			cookie.set("username", queriedUsername, { path: "/" });
			cookie.set("email", queriedEmail, { path: "/" });
			cookie.set("activated", queriedActivated, { path: "/" });

			dispatch(authActions.setUsername(queriedUsername));
			dispatch(authActions.setAdmin(queriedAdmin));
			setIsLoading(false);

			if (login) {
				history.push(`/songs/${queriedUsername}`);
			} else {
				history.push("/accounts/confirm-email");
			}
		} catch (err) {
			setIsLoading(false);
			alert(
				err.response
					? err.response.data
					: "There was an error handling your credentials."
			);
		}
	}

	return (
		<div style={styles.container}>
			{isLoading && <LoadingCircle />}

			<div>
				<h1 style={styles.header}>{login ? "Login" : "Sign Up"}</h1>
				<form>
					{/* Username */}
					<label style={styles.label} htmlFor="username">
						{login ? "Username/Email" : "Username"}
					</label>
					<br />
					<input
						id="username"
						style={styles.field}
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<br />

					{!login && (
						<div>
							<label style={styles.label} htmlFor="email">
								Email
							</label>
							<br />
							<input
								id="email"
								style={styles.field}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<br />
						</div>
					)}

					{/* Password */}
					<label style={styles.label} htmlFor="password">
						Password
					</label>
					<br />
					<input
						type="password"
						id="password"
						style={styles.field}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<br />

					{/* Repeated password */}
					{!login && (
						<div>
							<label
								style={styles.label}
								htmlFor="repeated-password"
							>
								Re-enter your password
							</label>
							<br />
							<input
								type="password"
								id="repeated-password"
								style={styles.field}
								value={repeatedPassword}
								onChange={(e) =>
									setRepeatedPassword(e.target.value)
								}
							/>
							<br />
						</div>
					)}

					{/* Buttons */}
					<div style={styles.buttonContainer}>
						<button style={styles.button} onClick={submitHandler}>
							Submit
						</button>
						<p onClick={switchModeHandler} style={styles.button}>
							Switch to {login ? "Sign up" : "Login"}
						</p>
					</div>

					{login && (
						<p
							style={styles.forgotPassword}
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

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import { styles } from "./ConfirmEmailStyles";
import { getEmail, getUsername, getActivationStatus } from "../../util";
import axios from "axios";

export default function ConfirmEmail() {
	const [email, setEmail] = useState();
	const [determiningActivated, setDeterminingActivated] = useState(false);

	const history = useHistory();

	useEffect(() => {
		const emailQuery = async () => {
			const queriedEmail = await getEmail();
			setEmail(queriedEmail);
		};

		if (!email) {
			emailQuery();
		}
	}, [email]);

	const activationHandler = async () => {
		setDeterminingActivated(true);
		try {
			const activated = await getActivationStatus(true);

			if (activated) {
				const username = await getUsername();
				history.push(`/songs/${username}`);
			} else {
				alert("Oops! Your account isn't activated yet!");
			}
		} catch (err) {
			alert("Could not get activated status.");
		}
		setDeterminingActivated(false);
	};

	const resendHandler = () => {
		try {
			axios.get("/api/auth/email/resend-activation", {
				withCredentials: true,
			});
			alert("Email was resent!");
		} catch (err) {
			alert("There was an error resending the email.");
		}
	};

	return (
		<div style={styles.container}>
			{(!email || determiningActivated) && <LoadingCircle />}
			<h2 style={styles.heading}>Your account is unactivated!</h2>
			<p style={styles.text}>
				An activation link has been sent to your inbox at{" "}
				<span className="emphasis">{email}</span>. Once you've pressed
				the link, click the button below to get started!
			</p>
			<div style={styles.buttonContainer}>
				<button style={styles.button} onClick={activationHandler}>
					Done!
				</button>
				<button style={styles.button} onClick={resendHandler}>
					Resend Email
				</button>
			</div>
		</div>
	);
}

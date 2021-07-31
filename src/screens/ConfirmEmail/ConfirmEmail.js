import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import { getEmail, getUsername, getActivationStatus } from "../../util";
import axios from "axios";
import Button from "../../components/Button/Button";
import ui from "../../styles/ui.module.css";
import layout from "../../styles/layout.module.css";

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
		<div className={layout.container}>
			{(!email || determiningActivated) && <LoadingCircle />}
			<h2 className={ui.subtitle}>Your account is unactivated!</h2>
			<p className={ui["plain-h4"]}>
				An activation link has been sent to your inbox at&nbsp;
				<span className={ui.emphasis}>{email}</span>. Once you've
				pressed the link, click the button below to get started!
			</p>
			<div className={layout["horizontal-around"]}>
				<Button onClick={activationHandler}>Done!</Button>
				<Button onClick={resendHandler}>Resend Email</Button>
			</div>
		</div>
	);
}

import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import styles from "./Profile.module.css";
import layout from "../../styles/layout.module.css";
import ui from "../../styles/ui.module.css";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import axios from "axios";
import CapitalText from "../../components/CapitalText/CapitalText";
import TextArea from "../../components/TextArea/TextArea";
import Button from "../../components/Button/Button";
import { getToken } from "../../util";

export default function Profile(props) {
	const username = props.match.params.username;

	const realUsername = useSelector((state) => state.auth.username);
	const [songCount, setSongCount] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [active, setActive] = useState("About");
	const [about, setAbout] = useState();
	const [imgUrl, setImgUrl] = useState();

	const aboutRef = useRef();

	const history = useHistory();

	useEffect(() => {
		const getImage = async () => {
			try {
				const response = await axios.get(
					`/api/auth/get_image/${username}`
				);

				const url = `media/${response.data}`;
				setImgUrl(url);
			} catch (err) {
				console.log(err.message);
			}
			setIsLoading(false);
		};

		getImage();
	}, []);

	useEffect(() => {
		const unlisten = history.listen(() => {
			setSongCount(null);
		});

		return () => unlisten();
	}, [history]);

	useEffect(() => {
		const getAbout = async () => {
			try {
				const response = await axios.get(
					`/api/auth/about/${username}`,
					{
						withCredentials: true,
					}
				);

				setAbout(response.data);
			} catch (err) {
				console.log(err.message);
			}
		};

		getAbout();
	}, [username]);

	useEffect(() => {
		const getCount = async () => {
			const existingValue = localStorage.getItem(username);

			if (existingValue) {
				setSongCount(existingValue);
				return;
			}

			try {
				const response = await axios.get(
					`/api/songs/${username}/count/`,
					{
						username: username,
					}
				);

				const cnt = response.data;
				setSongCount(cnt);

				localStorage.setItem(username, cnt);
			} catch (err) {
				// User enters a username that doesn't exist
				if (err.response && err.response.data) {
					alert(err.response.data);
				} else {
					alert("There was an error loading the page.");
				}

				history.push(`/user/${realUsername}`);
			}
		};

		getCount();
	}, [username, history, realUsername]);

	const changePasswordHandler = async () => {
		setIsLoading(true);
		const response = await axios.get(
			"/api/auth/email/password-change-link"
		);
		const link = response.data;
		setIsLoading(false);

		history.push(link);
	};

	const editAboutHandler = async () => {
		const inputAbout = aboutRef.current.value;

		setAbout(inputAbout);
		try {
			await axios.post(
				"/api/auth/set_about",
				{
					username: username,
					about: inputAbout,
				},
				{
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
						"X-CSRFToken": getToken(),
					},
				}
			);

			setActive("About");
		} catch (err) {
			console.log(err.message);
			alert("Biography couldn't save!");
		}
	};

	const imageChangeHandler = async (e) => {
		const image = e.target.files[0];

		const validExtensions = [".jpg", ".png"];

		const nameArray = image.name.split(".");
		const extension = nameArray[nameArray.length - 1].toLowerCase();
		if (!extension || validExtensions.indexOf(extension) === -1) {
			alert("Invalid file type.");
			e.target.value = "";
			return;
		}

		const formData = new FormData();
		formData.append("image", image);
		formData.append("username", username);

		try {
			const response = await axios.post("/api/auth/images/", formData, {
				withCredentials: true,
				headers: {
					"X-CSRFToken": getToken(),
				},
			});

			const image = response.data.image;
			setImgUrl(image);
		} catch (err) {
			console.dir(err.response);
		}
	};

	if (!songCount || about === null) {
		return <p></p>;
	}

	const menuButton = (text, onClick) => {
		const className =
			styles["menu-button"] +
			" " +
			(active === text ? styles["menu-button-active"] : "");

		const clickHandler = () => {
			if (onClick) {
				onClick();
			}
			setActive(text);
		};

		return (
			<p className={className} onClick={clickHandler}>
				{text}
			</p>
		);
	};

	if (isLoading) {
		return <p></p>;
	}

	return (
		<div className={layout.container}>
			<div className={`${layout["horizontal-end"]}`}>
				{menuButton("About")}
				{menuButton("Edit Profile")}
			</div>
			<hr className={`${layout["no-margin"]}`} />

			<div className={layout["horizontal-default-start"]}>
				<div className={layout["vertical-default"]}>
					<img
						src={
							imgUrl ??
							"https://hoursproject.com/cache/images/square_thumb/images/user/default.png"
						}
						alt="profile-pic"
						className={styles.picture}
					/>
					{active === "Edit Profile" && (
						<label class={styles["file-upload"]}>
							CUSTOM UPLOAD
							<input
								type="file"
								id="image"
								onChange={imageChangeHandler}
							/>
						</label>
					)}
				</div>
				<div className={layout["full-width"]}>
					<h2 className={`${ui["plain-h2"]} ${ui.italic}`}>
						{username}
					</h2>
					<p>
						<span className={ui.italic}>Songsheets created:</span>
						&nbsp;&nbsp;
						{songCount}
					</p>
					<h2 className={ui.subtitle}>About</h2>
					{active === "Edit Profile" ? (
						<div>
							<TextArea
								refName={aboutRef}
								lineCount={10}
								noLines
								defaultValue={about}
							/>
							<Button
								onClick={editAboutHandler}
								className={layout["align-block-right"]}
							>
								Submit
							</Button>
						</div>
					) : (
						<p className={ui["white-space"]}>
							{about === "" ? "No biography." : about}
						</p>
					)}
				</div>
			</div>
			{username === realUsername && active === "About" && (
				<CapitalText onClick={changePasswordHandler}>
					Change Password
				</CapitalText>
			)}
		</div>
	);
}

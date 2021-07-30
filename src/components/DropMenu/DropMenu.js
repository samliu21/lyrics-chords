import React, { useState } from "react";
import styles from "./DropMenu.module.css";
import ui from "../../styles/ui.module.css";
import layout from "../../styles/layout.module.css";

export default function DropMenu(props) {
	const [menuOpen, setMenuOpen] = useState(false);

	const menuOpenHandler = () => {
		setMenuOpen(true);
	};

	const menuCloseHandler = () => {
		setMenuOpen(false);
	};

	// Sample item:
	// { text: "Blah", onClick: () => console.log("Clicked"), condition: isAdmin }
	const menuOption = (item) => {
		return (
			<div
				onClick={item.onClick}
				className={
					props.white ? styles["white-option"] : styles["dropdown-option"]
				}
			>
				{item.text}
			</div>
		);
	};

	return (
		<div
			className={`${layout["column-default"]} ${layout["inline-block"]} ${layout.relative}`}
			onMouseEnter={menuOpenHandler}
			onMouseLeave={menuCloseHandler}
		>
			<div className={`${ui["nav-bar-link"]} ${ui["nav-bar-hover"]}`}>{props.title}</div>
			<div className={`${layout["column-default"]} ${styles.option}`}>
				{menuOpen &&
					props.items &&
					props.items.map(
						(item) => item.condition && menuOption(item)
					)}
			</div>
		</div>
	);
}

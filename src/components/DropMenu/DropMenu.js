import React, { useState } from "react";
import styles from "./DropMenu.module.css";
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
			<p onClick={item.onClick} className={styles.dropdownOption}>
				{item.text}
			</p>
		);
	};

	return (
		<div
			className={`${layout.columnDefault} ${layout.inlineBlock} ${layout.relative}`}
			onMouseEnter={menuOpenHandler}
			onMouseLeave={menuCloseHandler}
		>
			<div className={styles.hover}>{props.title}</div>
			<div className={`${layout.columnDefault} ${styles.option}`}>
				{menuOpen &&
					props.items.map(
						(item) => item.condition && menuOption(item)
					)}
			</div>
		</div>
	);
}

import React from "react";
import Options from "../Options/Options";
import { useSelector } from "react-redux";

import menu from "../../constants/images/menu.png";
import AutoScroll from "../AutoScroll/AutoScroll";
import styles from "./MenuBar.module.css";

export default function MenuBar(props) {
	const isSongPage = useSelector((state) => state.selectedSong.isSongPage);
	const isSongPageView = useSelector(
		(state) => state.selectedSong.isSongPageView
	);

	return (
		<div>
			<div className={styles.container}>
				<img
					src={menu}
					alt="menu"
					className={styles.image}
					onClick={props.onMenuClick}
				/>
				<div>
					<Options />
					{(isSongPage || isSongPageView) && (
						<AutoScroll />
					)}
				</div>
			</div>
		</div>
	);
}

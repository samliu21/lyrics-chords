import React from "react";
import Options from "../Options/Options";
import { useSelector } from "react-redux";

import { styles } from "./MenuBarStyles";
import menu from "../../constants/images/menu.png";
import AutoScroll from "../AutoScroll/AutoScroll";

export default function MenuBar(props) {
	const isSongPage = useSelector((state) => state.selectedSong.isSongPage);
	const isSongPageView = useSelector(
		(state) => state.selectedSong.isSongPageView
	);

	return (
		<div>
			<div style={styles.container}>
				<img
					src={menu}
					alt="menu"
					style={styles.image}
					onClick={props.onMenuClick}
				/>
				<div style={styles.rightDiv}>
					<Options />
					{(isSongPage || isSongPageView) && (
						<AutoScroll style={styles.linkStyle} />
					)}
				</div>
			</div>
		</div>
	);
}

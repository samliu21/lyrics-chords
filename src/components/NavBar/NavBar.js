import React from "react";

import { styles } from "./NavBarStyles";
import NavContent from "../NavContent/NavContent";

export default function NavBar() {
	return (
		<div style={styles.container}>
			<NavContent direction="row" />
		</div>
	);
}

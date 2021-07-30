import React from "react";

import NavContent from "../NavContent/NavContent";
import layout from "../../styles/layout.module.css";

export default function NavBar() {
	return (
		<div className={layout["fixed-top"]}>
			<NavContent direction="row" />
		</div>
	);
}

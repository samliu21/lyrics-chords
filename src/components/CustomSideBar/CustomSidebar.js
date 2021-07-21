import React from "react";
import Sidebar from "react-sidebar";

import NavContent from "../NavContent/NavContent";

export default function CustomSideBar(props) {
	const content = (
		<NavContent
			direction="column"
		/>
	);

	return (
		<Sidebar
			sidebar={content}
			open={props.menuOpen}
			onSetOpen={props.changeSidebar}
		>
			<div>
				{props.children}
			</div>
		</Sidebar>
	);
}

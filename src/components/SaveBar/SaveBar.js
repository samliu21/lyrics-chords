import React from "react";

import { AiOutlineSave } from "react-icons/ai";
import { Colors } from "../../constants/Colors";
import SideBarWrapper from "../SideBarWrapper/SideBarWrapper";

export default function SaveBar(props) {
	return (
		<SideBarWrapper
			WrappedComponent={AiOutlineSave}
			text="Saved!"
			top={150}
			onClick={props.onClick}
			backgroundColor={Colors.accent}
			color="white"
			time={2000}
		/>
	);
}

import React from "react";
import { useHistory } from "react-router";

import { BiHelpCircle } from "react-icons/bi";
import { Colors } from "../../constants/Colors";
import SideBarWrapper from "../SideBarWrapper/SideBarWrapper";

export default function SaveBar() {
	const history = useHistory();

	const onClick = () => {
		history.push("/help");
	}

	return (
		<SideBarWrapper
			WrappedComponent={BiHelpCircle}
			text=""
			top={250}
			onClick={onClick}
			backgroundColor={Colors.dark}
			color="white"
			time={0}
		/>
	);
}

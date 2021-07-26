import React from "react";

import { IoIosCopy } from "react-icons/io";
import { Colors } from "../../constants/Colors";
import SideBarWrapper from "../SideBarWrapper/SideBarWrapper";

export default function CopyButton(props) {
	return (
		<SideBarWrapper
			WrappedComponent={IoIosCopy}
			text="Copy mode!"
			top={200}
			onClick={props.onClick}
			backgroundColor={Colors.primary}
			color="white"
			time={750}
		/>
	);
}

import React, { useState } from "react";

import { IoIosCopy } from "react-icons/io";
import { Colors } from "../../constants/Colors";
import SideBarWrapper from "../SideBarWrapper/SideBarWrapper";

export default function CopyButton(props) {
	const [isCopyMode, setIsCopyMode] = useState(false);

	const onClick = () => {
		props.onClick();
		setIsCopyMode((state) => !state);
	};

	return (
		<SideBarWrapper
			WrappedComponent={IoIosCopy}
			text={isCopyMode ? "Copy mode!" : "Regular mode!"}
			top={200}
			onClick={onClick}
			backgroundColor={Colors.primary}
			color="white"
			time={500}
		/>
	);
}

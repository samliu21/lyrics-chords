import React, { useState, useRef, useEffect } from "react";

import { styles } from "./SideBarWrapperStyles";

export default function SideBarWrapper(props) {
	const [open, setOpen] = useState(false);
	const closeSidebarTimer = useRef();

	useEffect(() => {
		return () => {
			clearInterval(closeSidebarTimer.current);
		};
	}, []);

	// Click handler
	const clickHandler = () => {
		setOpen(true);

		clearInterval(closeSidebarTimer.current);
		closeSidebarTimer.current = setInterval(() => {
			setOpen(false);
			clearInterval(closeSidebarTimer.current);
		}, props.time);

		props.onClick(setOpen);
	};

	const Component = props.WrappedComponent;

	const containerStyle = {
		...styles.container,
		top: props.top,
		backgroundColor: props.backgroundColor,
	};

	const iconStyle = {
		...styles.icon,
		color: props.color,
	};

	return (
		<div style={containerStyle} onClick={clickHandler}>
			{open && <p style={styles.text}>{props.text}</p>}
			<Component style={iconStyle} />
		</div>
	);
}

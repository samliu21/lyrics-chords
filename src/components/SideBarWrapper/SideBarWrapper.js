import React, { useState, useRef, useEffect } from "react";

import ui from "../../styles/ui.module.css";

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
		if (closeSidebarTimer.current) {
			return;
		}
		setOpen(true);

		clearInterval(closeSidebarTimer.current);
		closeSidebarTimer.current = setInterval(() => {
			setOpen(false);
			clearInterval(closeSidebarTimer.current);
			closeSidebarTimer.current = null;
		}, props.time);

		props.onClick();
	};

	const Component = props.WrappedComponent;

	const containerStyle = {
		top: props.top,
		backgroundColor: props.backgroundColor,
	};

	const iconStyle = {
		color: props.color,
	};

	return (
		<div
			className={ui["sidebar-container"]}
			style={containerStyle}
			onClick={clickHandler}
		>
			{open && <p className={ui["sidebar-text"]}>{props.text}</p>}
			<Component className={ui["sidebar-icon"]} style={iconStyle} />
		</div>
	);
}

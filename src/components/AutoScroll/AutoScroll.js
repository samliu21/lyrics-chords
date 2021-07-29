import React, { useRef } from "react";

import CustomSlider from "../CustomSlider/CustomSlider";
import DropMenu from "../DropMenu/DropMenu";

export default function AutoScroll() {
	const scrollTimeout = useRef();
	const scrollSpeed = useRef(3);

	// On slider release, change the current speed and start scrolling
	const sliderChangeHandler = (_, val) => {
		scrollSpeed.current = val;
		pageScroll();
		window.addEventListener("mousemove", clearTimeoutHandler);
	};

	// Recursive page scroll method
	const pageScroll = () => {
		window.scrollBy(0, 1);
		scrollTimeout.current = setTimeout(
			pageScroll,
			90 / Math.sqrt(scrollSpeed.current)
		);
	};

	// Clear scroll timeout
	const clearTimeoutHandler = () => {
		clearTimeout(scrollTimeout.current);
		window.removeEventListener("mousemove", clearTimeoutHandler);
	};

	const items = [
		{
			text: (
				<CustomSlider
					onChangeCommitted={sliderChangeHandler}
					existingValue={scrollSpeed.current}
				/>
			),
			onClick: () => {},
			condition: true,
		},
	];

	return <DropMenu title="Auto Scroll" items={items} white />;
}

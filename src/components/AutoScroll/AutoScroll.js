import React, { useState, useRef } from "react";

import CustomSlider from "../CustomSlider/CustomSlider";
import { styles } from "./AutoScrollStyles";

export default function AutoScroll(props) {
	const [menuOpen, setMenuOpen] = useState(false);

	const scrollTimeout = useRef();
	const scrollSpeed = useRef(3);

	const { style } = props;

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

	return (
		<div
			onMouseEnter={() => setMenuOpen(true)}
			onMouseLeave={() => setMenuOpen(false)}
		>
			<div className="navBarLink navBarHover" style={style}>
				Auto-scroll
			</div>
			<div style={styles.outerDiv}>
				{menuOpen && (
					<div style={styles.slider}>
						<CustomSlider onChangeCommitted={sliderChangeHandler} existingValue={scrollSpeed.current} />
					</div>
				)}
			</div>
		</div>
	);
}

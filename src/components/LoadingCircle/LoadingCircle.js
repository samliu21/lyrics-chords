import React from "react";

import loadingCircle from "../../constants/images/loading-circle.gif";
import { styles } from "./LoadingCircleStyles";

export default function LoadingCircle() {
	return (
		<div style={styles.container}>
			<img src={loadingCircle} alt="Loading circle" style={styles.image} />
		</div>
	);
}

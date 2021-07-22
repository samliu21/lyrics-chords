import React, { useState } from "react";
import { IconContext } from "react-icons";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";

import { Colors } from "./constants/Colors";
import LoadingCircle from "./components/LoadingCircle/LoadingCircle";
import Router from "./components/Router/Router";
import { persistor, store } from "./store/store";

export default function App() {
	// Orientation state
	const [orientation, setOrientation] = useState(
		window.matchMedia("(orientation: landscape)").matches
	);

	// Listen to changes in orientation
	window
		.matchMedia("(orientation: landscape)")
		.addEventListener("change", () => {
			setOrientation(
				window.matchMedia("(orientation: landscape)").matches
			);
		});

	const iconValues = {
		color: Colors.primary,
		size: "1.5em",
	};

	return (
		// Redux provider 
		<Provider store={store}>
			{/* Redux persistor  */}
			<PersistGate persistor={persistor} loading={<LoadingCircle />}>
				{/* Redux router  */}
				<HashRouter>
					{/* Default icon values  */}
					<IconContext.Provider value={iconValues}>
						{orientation ? <Router horizontal /> : <Router />}
					</IconContext.Provider>
				</HashRouter>
			</PersistGate>
		</Provider>
	);
}

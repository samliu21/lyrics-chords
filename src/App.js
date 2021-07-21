import React, { useState } from "react";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { IconContext } from "react-icons";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./store/store";
import LongRouter from "./components/LongRouter/LongRouter";
import ThinRouter from "./components/ThinRouter/ThinRouter";
import { Colors } from "./constants/Colors";
import LoadingCircle from "./components/LoadingCircle/LoadingCircle";

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

	// Return a different route based on the orientation
	// LongRouter = landscape, ThinRouter = portrait
	return (
		<Provider store={store}>
			<PersistGate persistor={persistor} loading={<LoadingCircle />}>
				<HashRouter>
					<IconContext.Provider value={iconValues}>
						{orientation ? <LongRouter /> : <ThinRouter />}
					</IconContext.Provider>
				</HashRouter>
			</PersistGate>
		</Provider>
	);
}

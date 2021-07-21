import React from "react";
import { Slider } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Colors } from "../../constants/Colors";

const theme = createMuiTheme({
	overrides: {
		MuiSlider: {
			thumb: {
				color: Colors.accent,
			},
			track: {
				color: Colors.primary,
			},
			rail: {
				color: "black",
			},
		},
	},
});

export default function CustomSlider(props) {
	const { existingValue, onChangeCommitted } = props;

	const sliderStyles = {
		width: "100%",
	}

	return (
		<ThemeProvider theme={theme}>
			<Slider
				onChangeCommitted={onChangeCommitted}
				style={sliderStyles}
				defaultValue={existingValue ?? 3}
				step={1}
				marks
				min={1}
				max={5}
			/>
		</ThemeProvider>
	);
}

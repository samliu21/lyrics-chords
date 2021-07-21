import { Colors } from "../../constants/Colors";

export const styles = {
	allowWhiteSpace: {
		whiteSpace: "pre-wrap",
	},
	artist: {
		textAlign: "center",
		fontStyle: "italic",
		fontSize: "3.5vmin",
	},
	container: {
		padding: "6vmin",
	},
	fetching: {
		color: Colors.accent,
		paddingLeft: 20,
	},
	input: {
		fontSize: "2.3vmin",
		borderColor: Colors.primary,
		borderWidth: 1,
		padding: 5,
		borderStyle: "dotted",
		width: "100%",
		display: "block",
		color: Colors.accent,
		backgroundColor: "white",
	},
	lyrics: {
		marginBottom: "10vh",
	},
	subheading: {
		color: Colors.primary,
		fontSize: "4vmin",
	},
	title: {
		textAlign: "center",
		fontSize: "6vmin",
	},
};

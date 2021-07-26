import { Colors } from "../../constants/Colors";

export const styles = {
	input: {
		whiteSpace: "pre-wrap",
		fontSize: "2.3vmin",
		backgroundColor: "white",
		borderColor: Colors.primary,
		borderWidth: 1,
		padding: 5,
		borderStyle: "dotted",
		width: "100%",
		display: "block",
		color: Colors.accent,
		marginTop: 2,
		marginBottom: 2,
	},
	lyricLine: {
		marginBottom: 10,
		marginTop: 0,
		fontSize: "2.3vmin",
	},
	lyricsTitle: {
		color: Colors.primary,
		fontSize: "4vmin",
	},
	toolbar: {
		position: "fixed",
		bottom: 0,
		left: 0,
		textAlign: "center",
		padding: 8,
		backgroundColor: Colors.primary,
		color: "white",
		width: "100%",
	},
};

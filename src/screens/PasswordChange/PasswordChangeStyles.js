import { Colors } from "../../constants/Colors"

export const styles = {
	button: {
		backgroundColor: Colors.primary,
		color: "white",
		borderWidth: 0,
		padding: "1.5vh 3vw",
		fontSize: "2vmin",
		textDecoration: "none",
		textAlign: "center",
		margin: 0,
		cursor: "pointer",
		marginTop: 30,
	},
	container: {
		padding: "6vmin",
	},
	heading: {
		fontSize: "4vmin",
	},
	horizontal: {
		display: "flex",
		alignItems: "center",
	},
	input: {
		backgroundColor: Colors.accent,
		width: 250,
		maxWidth: "60vw",
		padding: 10,
		color: "white",
		borderRadius: 10,
		borderWidth: 0,
	},
	text: {
		marginRight: 30,
	},
}
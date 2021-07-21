import { Colors } from "../../constants/Colors";

export const styles = {
	container: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.accent,
		position: "fixed",
		left: -17,
		borderRadius: 17,
		padding: 5,
		paddingLeft: 27,
		paddingRight: 8,
	},
	save: {
		color: "white",
		cursor: "pointer",
	},
	text: {
		color: "white",
		paddingRight: 10,
		fontSize: "2vmin",
		margin: 0,
	},
}
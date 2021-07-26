import { Colors } from "../../constants/Colors";

export const styles = {
	container: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.accent,
		position: "fixed",
		left: -17,
		top: 150,
		borderRadius: 17,
		padding: 5,
		paddingLeft: 27,
		paddingRight: 8,
	},
	icon: {
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
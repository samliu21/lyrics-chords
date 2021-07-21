import { Colors } from "../../constants/Colors";

export const styles = {
	button: {
		cursor: "pointer",
		color: "white",
	},
	close: {
		cursor: "pointer",
		color: "white",
		paddingRight: 5,
	},
	container: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.accent,
		position: "fixed",
		borderRadius: 17,
		left: -17,
		padding: 5,
		paddingLeft: 27,
		paddingRight: 8,
	},
	input: {
		borderWidth: 0,
		fontSize: "2vmin",
		backgroundColor: "transparent",
		color: "white",
		width: "15vw",
		marginRight: 10,
	},
	x: {
		cursor: "pointer",
		color: "white",
		paddingRight: 5,
	},
};

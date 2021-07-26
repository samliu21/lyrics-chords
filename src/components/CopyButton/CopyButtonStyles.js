import { Colors } from "../../constants/Colors";

export const styles = {
	container: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.primary,
		position: "fixed",
		left: -17,
		top: 200,
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
		margin: 0,
		fontSize: "2vmin",
	},
};

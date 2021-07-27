import { Colors } from "../../constants/Colors";

export const styles = {
	container: {
		borderWidth: 1,
		borderColor: "black",
		borderStyle: "solid",
		padding: 20,
		backgroundColor: "white",
	},
	horizontalContainer: {
		display: "flex",
		flexDirection: "row",
	},
	username: {
		marginRight: 5,
		color: Colors.accent,
		fontWeight: "bold",
		fontStyle: "italic",
	},
};

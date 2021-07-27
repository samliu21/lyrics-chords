import { Colors } from "../../constants/Colors";

export const styles = {
	container: {
		borderWidth: 1,
		borderColor: "black",
		borderStyle: "solid",
		padding: 20,
		backgroundColor: "white",
		marginTop: 10,
		marginBottom: 10,
	},
	horizontalContainer: {
		display: "flex",
		flexDirection: "row",
		marginBottom: 10,
	},
	username: {
		marginRight: 5,
		color: Colors.accent,
		fontWeight: "bold",
		fontStyle: "italic",
	},
	contents: {
		marginTop: 10,
	},
};

import { Colors } from "../../constants/Colors";

export const styles = {
	button: {
		backgroundColor: Colors.primary,
		color: "white",
		borderWidth: 0,
		padding: "1vh 2vw",
		fontSize: "2vmin",
		textDecoration: "none",
		display: "block",
		cursor: "pointer",
		textAlign: "right",
	},
	container: {
		borderWidth: 1,
		borderColor: "black",
		borderStyle: "solid",
		padding: 20,
		backgroundColor: "white",
	},
	contents: {
		marginTop: 10,
	},
	horizontalContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	input: {
		width: "100%",
		padding: 5,
		fontSize: "2vmin",
		marginTop: 10,
	},
	outerContainer: {
		marginTop: 10,
		marginBottom: 10,
	},
	replyContainer: {
		marginTop: 10,
		marginLeft: 20,
	},
	trash: {
		marginLeft: 5,
		marginRight: 5,
	},
	username: {
		marginRight: 5,
		color: Colors.accent,
		fontWeight: "bold",
		fontStyle: "italic",
	},
};

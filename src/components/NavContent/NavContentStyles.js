import { Colors } from "../../constants/Colors";

export const styles = {
	container: {
		display: "flex",
		justifyContent: "space-between",
		backgroundColor: Colors.primary,
		height: "100%",
		alignItems: "center",
		color: "white",
		position: "relative",
	},
	leftContainer: {
		display: "flex",
		alignItems: "center",
	},
	link: {
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 15,
		paddingBottom: 15,
	},
	loginColumn: {
		paddingBottom: "3vh",
	},
	loginRow: {
		marginRight: "3vw",
	},
	viewOnlyText: {
		textAlign: "center",
		backgroundColor: "grey",
		color: "white",
		paddingTop: 7,
		paddingBottom: 7,
		fontSize: "1.5vmin",
	},
};

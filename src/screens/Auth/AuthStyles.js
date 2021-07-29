import { Colors } from "../../constants/Colors";

export const styles = {
	buttonContainer: {
		display: "flex",
		justifyContent: "space-between",
		marginTop: 10,
		alignItems: "center",
	},
	container: {
		padding: "6vmin",
		backgroundColor: Colors.light,
	},
	field: {
		marginBottom: 20,
		marginTop: 10,
		padding: 10,
		width: "100%",
		borderRadius: 15,
		borderColor: Colors.dark,
		borderWidth: 2,
		borderStyle: "solid",
		fontSize: "2.7vmin",
	},
	forgotPassword: {
		color: Colors.accent,
		marginTop: "7vh",
		fontSize: "2vmin",
		cursor: "pointer",
	},
	header: {
		fontSize: "6vmin",
	},
	label: {
		color: Colors.accent,
		fontSize: "3.5vmin",
	},
};

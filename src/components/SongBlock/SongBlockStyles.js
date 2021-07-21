import { Colors } from "../../constants/Colors";

export const styles = {
	arrow: {
		height: "7vmin",
	},
	artist: {
		fontSize: "2.5vmin",
	},
	buttonContainer: {
		paddingRight: "5vw",
	},
	creator: {
		marginBottom: "3vmin",
		marginTop: "6vmin",
	},
	creatorName: {
		color: Colors.primary,
	},
	eye: {
		cursor: "pointer",
		marginBottom: 15,
	},
	horizontal: {
		display: "flex",
		alignItems: "center",
	},
	imageContainer: {
		display: "flex",
		flex: 1,
		flexGrow: 1,
		justifyContent: "flex-end",
		cursor: "pointer",
		marginLeft: 10,
		marginRight: "4vw",
	},
	name: {
		fontSize: "4vmin",
	},
	songContainer: {
		borderColor: "black",
		borderWidth: "0.35vmin",
		borderStyle: "solid",
		padding: 10,
		paddingLeft: "5vw",
		borderRadius: "5vmin",
		marginBottom: "3vh",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "white",
	},
	trashCan: {
		cursor: "pointer",
	},
}
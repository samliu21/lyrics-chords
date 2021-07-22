import { Colors } from "../../constants/Colors";

export const styles = {
	arrow: {
		height: "7vmin",
	},
	artist: {
		borderWidth: 0,
		fontSize: "2.5vmin",
		textOverflow: "ellipsis",
	},
	buttonContainer: {
		paddingRight: "5vw",
	},
	creator: {
		marginBottom: "3vmin",
		marginTop: "5vmin",
	},
	creatorName: {
		color: Colors.primary,
	},
	eye: {
		cursor: "pointer",
		margin: "10 0",
	},
	horizontal: {
		alignItems: "center",
		display: "flex",
	},
	imageContainer: {
		alignItems: "center",
		cursor: "pointer",
		display: "flex",
		flex: 1,
		flexGrow: 1,
		justifyContent: "flex-end",
		marginRight: "4vw",
	},
	name: {
		fontSize: "4vmin",
		color: Colors.accent,
		borderWidth: 0,
		fontWeight: "bold",
		marginBottom: 15,
		textOverflow: "ellipsis",
	},
	songContainer: {
		alignItems: "center",
		backgroundColor: "white",
		borderColor: "black",
		borderRadius: "5vmin",
		borderStyle: "solid",
		borderWidth: "0.35vmin",
		display: "flex",
		justifyContent: "space-between",
		paddingLeft: "5vw",
		marginBottom: "3vh",
		padding: 30,
	},
	star: {
		cursor: "pointer",
	},
	trashCan: {
		cursor: "pointer",
	},
	views: {
		fontSize: "3.5vmin",
		marginLeft: "4vw",
	},
}
import { Colors } from "../../constants/Colors";

export const styles = {
	container: {
		backgroundColor: Colors.primary,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		top: 0,
		position: "sticky",
	},
	image: {
		height: "2vh",
		cursor: "pointer",
		margin: "0 3vw",
	},
	linkStyle: {
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 15,
		paddingBottom: 15,
	},
	rightDiv: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
}
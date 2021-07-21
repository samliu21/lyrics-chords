import React, { useEffect } from "react";
import { useHistory } from "react-router";

export default function RedirectScreen(props) {
	const history = useHistory();

	useEffect(() => {
		const timeout = setTimeout(() => {
			history.push(
				props.location.state ? props.location.state.url : "/accounts/login"
			);
		}, 2000);

		return () => clearTimeout(timeout);
	}, [history, props.location.state]);

	return (
		<div className="horizontal-default">
			<h2>
				{props.location.state && props.location.state.message + ". "}
				Redirecting...
			</h2>
		</div>
	);
}

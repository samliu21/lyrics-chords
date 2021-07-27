import React from "react";

export default function CommentsBlock(props) {
	console.log(props);
	const { username, contents, date, } = props;
	console.log(username);

	return (
		<div>
			<p>{username}</p>
			<p>{contents}</p>
			<p>{date}</p>
		</div>
	)
}
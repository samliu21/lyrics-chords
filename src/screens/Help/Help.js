import React from "react";

import { styles } from "./HelpStyles";

export default function Help() {
	return (
		<div style={styles.container}>
			<h1 style={styles.heading}>Help Page</h1>
			<h2 style={styles.subheading}>Song List Page</h2>
			<div style={styles.border}>
				<div>
					You can find your Song List by clicking on the&nbsp;
					<span className="italic">Song List</span> section of the
					navigation bar. You can add a song by pressing the&nbsp;
					<span className="italic">ADD SONG</span> button in the top
					right corner, delete a song by pressing the trash can,
					toggle the public visibility by pressing the eye, and start
					making your songsheet by pressing the arrow at the right!{" "}
				</div>
				<br />
				<div>
					You can also filter your songs by pressing the mangifiying
					glass near the top left!
				</div>
			</div>
			<h2 style={styles.subheading}>Song Page</h2>
			<div style={styles.border}>
				<div>
					The song page can be reached by pressing the right arrow on
					any one of your songs! Start by typing the name and artist
					of your song at the top of the page. In the options dropdown
					menu in the navigation bar, selecting&nbsp;
					<span className="italic">Fetching Lyrics</span> will fetch
					the lyrics of the song and artist you've inputted. The
					fetched lyrics will appear in the&nbsp;
					<span className="italic">Pulled Lyrics</span> section of the
					page. If the lyrics of your song cannot be fetched, another
					option is to type or copy the lyrics directly into the&nbsp;
					<span className="italic">Pulled Lyrics</span> section of the
					page.
				</div>
				<br />
				<div>
					Then, use the&nbsp;
					<span className="italic">Transfer Lyrics</span> option to
					move the pulled lyrics to the{" "}
					<span className="italic">Lyrics section</span>, where you
					can then enter chords over each line.
				</div>
				<br />
				<div>
					The chord inputs have been configured so that a period will
					move your cursor forward four spaces, a comma will move your
					cursor back four spaces, and enter will save the changes
					you've made.
				</div>
				<br />
				<div>
					Using auto-scroll is really simple! Press the auto scroll
					button in the top bar, select a speed, and the page will
					start scrolling! Simply move your mouse when you want the
					scroll to stop.
				</div>
			</div>
			<h2 style={styles.subheading}>Public Page</h2>
			<div style={styles.border}>
				You can find a public list of songsheets by clicking on
				the&nbsp;
				<span className="italic">Public</span> section of the navigation
				bar. You can only edit a public songsheet if you are the owner
				or were explicitly granted editing privelleges.
			</div>
			<h2 style={styles.subheading}>Bugs</h2>
			<div style={styles.border}>
				If you discover a bug, please email me at sam4button@gmail.com
				or report an issue on my&nbsp;
				<a href="https://github.com/samliu21/lyrics-chords-heroku/issues">
					GitHub page
				</a>
				.
			</div>
		</div>
	);
}

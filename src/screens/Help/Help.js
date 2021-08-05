import React from "react";

import styles from "./Help.module.css";
import layout from "../../styles/layout.module.css";
import ui from "../../styles/ui.module.css";

export default function Help() {
	return (
		<div className={layout.container}>
			<h1 className={ui.title}>Help Page</h1>
			<h2 className={ui.subtitle}>Song List Page</h2>
			<div className={styles.border}>
				<div>
					You can find your Song List by clicking on the&nbsp;
					<span className={ui.italic}>Song List</span> section of the
					navigation bar. You can add a song by pressing the&nbsp;
					<span className={ui.italic}>ADD SONG</span> button in the top
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
			<h2 className={ui.subtitle}>Song Page</h2>
			<div className={styles.border}>
				<div>
					The song page can be reached by pressing the right arrow on
					any one of your songs! Start by typing the name and artist
					of your song at the top of the page. In the options dropdown
					menu in the navigation bar, selecting&nbsp;
					<span className={ui.italic}>Fetching Lyrics</span> will fetch
					the lyrics of the song and artist you've inputted. The
					fetched lyrics will appear in the&nbsp;
					<span className={ui.italic}>Pulled Lyrics</span> section of the
					page. If the lyrics of your song cannot be fetched, another
					option is to type or copy the lyrics directly into the&nbsp;
					<span className={ui.italic}>Pulled Lyrics</span> section of the
					page.
				</div>
				<br />
				<div>
					Then, use the&nbsp;
					<span className={ui.italic}>Transfer Lyrics</span> option to
					move the pulled lyrics to the{" "}
					<span className={ui.italic}>Lyrics section</span>, where you
					can then enter chords over each line.
				</div>
				<br />
				<div>
					By default, you will be in regular mode. To switch, press
					the copy button on the left—the second icon down. Here, you
					can quickly manipulate chords by copying or deleting. To
					select a chord to manipulate, simply click on its box. To
					select a sequence of inputs, click on an input to denote the
					starting point (highlighted in dark red), then press on the
					end input box while holding the ALT (on Windows) or OPTION
					key (on Mac). The toolbar can be found at the bottom of the
					page. To delete, simply choose the EMPTY option. To copy,
					choose the COPY or COPY UNTIL END option. Then, select the
					first of the destination inputs that will receive the copied
					chords. For example, if you select inputs 1 to 3, select
					COPY, then click the fourth input, the contents of inputs 1
					to 3 will be copied to inpus 4 to 6. Lastly, the CLEAR
					option will deselect all chord boxes.
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
			<h2 className={ui.subtitle}>Public Page</h2>
			<div className={styles.border}>
				You can find a public list of songsheets by clicking on
				the&nbsp;
				<span className={ui.italic}>Public</span> section of the navigation
				bar. You can only edit a public songsheet if you are the owner
				or were explicitly granted editing privelleges.
			</div>
			<h2 className={ui.subtitle}>Bugs</h2>
			<div className={styles.border}>
				If you discover a bug, please email me at sam4button@gmail.com
				or report an issue on my&nbsp;
				<a href="https://github.com/samliu21/lyrics-chords/issues">
					GitHub page
				</a>
				.
			</div>
		</div>
	);
}

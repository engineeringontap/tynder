import React from "react";
import styles from "./App.module.css";
import dislike from "./assets/cross.png";
import like from "./assets/heart.png";
import { useTechnologies, Technology } from "./firestore";

const Control: React.SFC<{ icon: string }> = ({ icon }) => (
	<div className={styles.controlItem}>
		<img src={icon} alt="" className={styles.controlIcon} />
	</div>
);

const SwipeCard: React.SFC<{ t: Technology }> = ({ t: { name, image, id } }) => (
	<div
		key={id}
		className={styles.card}
		style={{
			backgroundImage: `url("${image}")`
		}}
	>
		<div className={styles.cardOverlay}>
			<span className={styles.itemName}>{name}</span>
		</div>
	</div>
);

export const App: React.SFC = () => {
	const { technologies } = useTechnologies();
	return (
		<div className={styles.root}>
			<header className={styles.header}>
				<span className={styles.title}>tynder 🔥</span>
				<span className={styles.subtitle}>by engineeringontap</span>
			</header>
			<div className={styles.cardWrapper}>
				{technologies.map(t => (
					<SwipeCard t={t} />
				))}
			</div>
			<div className={styles.controls}>
				<Control icon={dislike} />
				<Control icon={like} />
			</div>
		</div>
	);
};

export default App;

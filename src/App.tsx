import React from "react";
import styles from "./App.module.css";
import dislike from "./assets/cross.png";
import like from "./assets/heart.png";
import { useTechnologies, Technology } from "./firestore";
import SwipeableViews from "react-swipeable-views";

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

const swipeStyle = {
	root: {
		flex: 1,
		width: "100%",
		display: "flex",
		boxShadow: "0 16px 40px rgba(0,0,0,0.12)"
	},
	container: {
		width: "100%",
		flex: 1
	},
	child: {
		overflow: "hidden",
		height: "100%",
		width: "100%",
	}
};

const handleIndexChange = (index, indexLatest, meta) => {
	console.log(index, indexLatest, meta)
	if(index > indexLatest) {
		console.log("dislike!")
	} else {
		console.log("like!");

	}
}

export const App: React.SFC = () => {
	const { technologies } = useTechnologies();
	return (
		<div className={styles.root}>
			<header className={styles.header}>
				<span className={styles.title}>tynder 🔥</span>
				<span className={styles.subtitle}>by engineeringontap</span>
			</header>
			<div className={styles.cardWrapper}>
				<SwipeableViews
					onChangeIndex={handleIndexChange}
					style={swipeStyle.root}
					containerStyle={swipeStyle.container}
					slideStyle={swipeStyle.child}
					resistance={true}
					hysteresis={0.9}
				>
					{technologies.map(t => (
						<SwipeCard key={t.id} t={t} />
					))}
				</SwipeableViews>
			</div>
			<div className={styles.controls}>
				<Control icon={dislike} />
				<Control icon={like} />
			</div>
		</div>
	);
};

export default App;

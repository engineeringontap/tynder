import React from "react";
import dislikeImage from "./assets/cross.png";
import likeImage from "./assets/heart.png";
import beerImage from "./assets/beer.svg";
import { dislike, like, Technology, useRatings, useTechnologies } from "./firestore";
import styles from "./Rate.module.css";

const Control: React.SFC<{ icon: string; onClick: () => void }> = ({ icon, onClick }) => (
	<div className={styles.controlItem} onClick={onClick}>
		<img src={icon} alt="" className={styles.controlIcon} />
	</div>
);

const EmptyState: React.SFC = () => (
	<div className={styles.emptyState}>
		<h2>Done and done! No go drink some beer!</h2>
		<img src={beerImage} className={styles.beerLogo} />
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

interface IProps {
	userId: string;
	path: string;
}

export const Rate: React.SFC<IProps> = ({ userId }) => {
	const technologies = useTechnologies();
	const ratings = useRatings(userId);

	const unratedTechs = technologies.filter(t => !ratings.includes(t.id));

	const handleLike = (t: Technology) => {
		return () => {
			console.log("like", t);
			like(t.id, userId);
		};
	};

	const handleDislike = (t: Technology) => {
		return () => {
			console.log("dislike", t);
			dislike(t.id, userId);
		};
	};

	const currentTech = unratedTechs[0];

	const hasTechs = Boolean(unratedTechs.length > 0);

	return (
		<div className={styles.root}>
			{hasTechs ? (
				<>
					<div className={styles.cardWrapper}>
						<SwipeCard t={currentTech} />
					</div>
					<div className={styles.controls}>
						<Control icon={dislikeImage} onClick={handleDislike(currentTech)} />
						<Control icon={likeImage} onClick={handleLike(currentTech)} />
					</div>
				</>
			) : (
				<EmptyState />
			)}
		</div>
	);
};

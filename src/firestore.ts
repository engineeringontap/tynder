import firebase from "firebase";
import { firestore } from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { techs } from "./techs";

const config = {
	apiKey: "AIzaSyCB_A1DtilReOg9gP8_BmexaNHA-vzT72U",
	authDomain: "engineeringontap-49ca3.firebaseapp.com",
	databaseURL: "https://engineeringontap-49ca3.firebaseio.com",
	projectId: "engineeringontap-49ca3",
	storageBucket: "engineeringontap-49ca3.appspot.com",
	messagingSenderId: "102977610816"
};

firebase.initializeApp(config);

export interface Technology {
	id: string;
	name: string;
	link: string;
	image: string;
}
export interface Rating {
	id: string;
}
export interface Stat {
	id: string;
	name: string;
	likes: number;
	dislikes: number;
}
export interface Stats {
	[id: string]: Stat;
}
export type Unsubscribe = () => void;

firestore()
	.enablePersistence()
	.catch(err => {
		console.log("Persistence disabled: ", err.code);
		if (err.code === "failed-precondition") {
			// Multiple tabs open, persistence can only be enabled
			// in one tab at a a time.
			// ...
		} else if (err.code === "unimplemented") {
			// The current browser does not support all of the
			// features required to enable persistence
			// ...
		}
	});

export const like = (techId, userId) => {
	firestore()
		.collection(`technologies/${techId}/likes`)
		.add({
			userId
		});

	setRating(techId, userId);
};

const setRating = (techId, userId) => {
	firestore()
		.collection(`users/${userId}/ratings`)
		.add({
			techId
		});
};

export const dislike = (techId, userId) => {
	firestore()
		.collection(`technologies/${techId}/dislikes`)
		.add({
			userId
		});

	setRating(techId, userId);
};

export const insertTechnologies = () => {
	console.log("adding", techs.length, techs);

	techs.forEach(t => {
		firestore()
			.collection("technologies")
			.add(t);
	});
};

export const useTechnologies = () => {
	const [technologies, setTechnologies] = useState<any[]>([]);

	useEffect(() => {
		return firestore()
			.collection("technologies")
			.onSnapshot(({ docs }) => {
				setTechnologies(
					docs.map<Technology>(doc => {
						const { name, link, image } = doc.data();
						return {
							id: doc.id,
							name,
							link,
							image
						};
					})
				);
			});
	}, []);

	return technologies;
};

export const useRatings = userId => {
	const [ratings, setRatings] = useState<any[]>([]);

	useEffect(() => {
		return firestore()
			.collection(`users/${userId}/ratings`)
			.onSnapshot(({ docs }) => {
				setRatings(
					docs.map<string>(doc => {
						const { techId } = doc.data();
						return techId;
					})
				);
			});
	}, []);

	return ratings;
};

export const useStats = () => {
	const [stats, setStats] = useState<Stats>({});
	let cache = {};

	const update = (stat: any) => {
		setStats({
			...cache,
			[stat.id]: {
				...cache[stat.id],
				...stat
			}
		});
	};

	useEffect(() => {
		const unsubscribers: Unsubscribe[] = [];

		const root = firestore()
			.collection("technologies")
			.onSnapshot(({ docs }) => {
				docs.forEach(doc => {
					const id = doc.id;
					const { name } = doc.data();

					const child = firestore()
						.collection(`technologies/${id}/likes`)
						.onSnapshot(({ docs: docs2 }) => {
							const likes = docs2.length;
							const stat = {
								id,
								name,
								likes
							};
							cache = {
								...cache,
								[stat.id]: {
									...cache[id],
									...stat
								}
							};
							update(stat);
						});

					unsubscribers.push(child);

					const child2 = firestore()
						.collection(`technologies/${id}/dislikes`)
						.onSnapshot(({ docs: docs2 }) => {
							const dislikes = docs2.length;
							const stat = {
								id,
								name,
								dislikes
							};
							cache = {
								...cache,
								[stat.id]: {
									...cache[id],
									...stat
								}
							};
							update(stat);
						});

					unsubscribers.push(child2);
				});
			});

		unsubscribers.push(root);

		return () => unsubscribers.forEach(unsubscriber => unsubscriber());
	}, []);

	return stats;
};

import firebase, { User } from "firebase";
import { firestore } from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";

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
	const techs = [
		{
			name: "NodeJS",
			image:
				"https://upload.wikimedia.org/wikipedia/de/thumb/e/e1/Java-Logo.svg/1200px-Java-Logo.svg.png"
		},
		{
			name: "Kubernetes",
			image:
				"https://i1.wp.com/softwareengineeringdaily.com/wp-content/uploads/2019/01/Kubernetes_New.png?resize=730%2C389&ssl=1"
		},
		{
			name: "Java",
			image:
				"https://upload.wikimedia.org/wikipedia/de/thumb/e/e1/Java-Logo.svg/1200px-Java-Logo.svg.png"
		},
		{
			name: "Python",
			image:
				"https://static.makeuseof.com/wp-content/uploads/2018/02/control-arduino-python-670x335.jpg"
		},
		{
			name: "TensorFlow",
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/TensorFlowLogo.svg/2000px-TensorFlowLogo.svg.png"
		}
	];
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

	return { technologies };
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

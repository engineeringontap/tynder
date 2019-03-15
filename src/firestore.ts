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

export const sendLove = (from: User, to: User) =>
	firestore()
		.collection(`love/${to.uid}/love`)
		.add({
			from
		});

export const useTechnologies = () => {
	const [technologies, setTechnologies] = useState<any[]>([]);

	useEffect(() => {
		return firestore()
			.collection("technologies")
			.onSnapshot(({ docs }) => {
				console.log(docs);
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

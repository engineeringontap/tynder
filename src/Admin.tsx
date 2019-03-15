import React from "react";
import { insertTechnologies } from "./firestore";

interface IProps {
	path: string;
}

export const Admin: React.SFC<IProps> = () => {
	return (
		<div>
			<button onClick={insertTechnologies}>insert techs</button>
		</div>
	);
};

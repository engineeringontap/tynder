import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { useTechnologies, useStats } from "./firestore";
import styles from "./Stats.module.css";

// const data = [
// 	{
// 		name: "React",
// 		likes: 10,
// 		dislikes: 5
// 	}
// ];

interface IProps {
	path: string;
}

export const Stats: React.SFC<IProps> = () => {
	const stats = useStats();

	const data = Object.keys(stats).map(key => stats[key]);

	console.log("stats", stats);

	return (
		<div className={styles.root}>
			<BarChart
				width={500}
				height={300}
				data={data}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="likes" fill="#388E3C" />
				<Bar dataKey="dislikes" fill="#D32F2F" />
			</BarChart>
		</div>
	);
};

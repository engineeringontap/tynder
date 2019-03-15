import React from "react";
import styles from "./Header.module.css";

export const Header: React.SFC = () => {
	return (
		<header className={styles.header}>
			<span className={styles.title}>tynder 🔥</span>
			<span className={styles.subtitle}>by engineeringontap</span>
		</header>
	);
};

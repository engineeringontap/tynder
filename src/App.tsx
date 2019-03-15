import { Router } from "@reach/router";
import Fingerprint from "fingerprintjs";
import React from "react";
import styles from "./App.module.css";
import { Header } from "./Header";
import { Rate } from "./Rate";
import { Stats } from "./Stats";
import { Admin } from "./Admin";

export const App: React.SFC = () => {
	const fingerprint = new Fingerprint().get();
	return (
		<div className={styles.root}>
			<Header />
			<Router className={styles.routerWrapper}>
				<Rate userId={fingerprint} path="/" />
				<Stats path="/stats" />
				<Admin path="/admin" />
			</Router>
		</div>
	);
};

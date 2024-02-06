import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import store from "./store";
import useAuthentication from "./hooks/useAuthentication";
import useServices from "./hooks/useServices";

const ConnectedApp = () => {
	const {AuthProvider} = useAuthentication();
	const {ServicesProvider} = useServices();
	return (
		<AuthProvider>
			<ServicesProvider>
				<Provider store={store}>
					<App />
				</Provider>
			</ServicesProvider>
		</AuthProvider>
	);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<ConnectedApp />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

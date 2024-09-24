import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
	const { user } = useContext(AuthContext);
	return (
		<div>
			<Routes>
				<Route
					path="/"
					element={user ? <Lobby /> : <Login />}
				/>
				<Route
					path="/Login"
					element={!user ? <Login /> : <Lobby />}
				/>
				<Route
					path="/Register"
					element={!user ? <Register /> : <Lobby />}
				/>

				<Route
					path="*"
					element={<Navigate to="/" />}
				/>
			</Routes>
		</div>
	);
}

export default App;

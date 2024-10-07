import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import Game from './pages/GameBoard'
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import { ChatContextProvider } from './context/ChatContext';
import GameContextProvider from './context/GameContext';

function App() {
	const { user } = useContext(AuthContext);
	return (
		<div>
			<ChatContextProvider user={user}>
				<GameContextProvider user={user}>
					<Navbar />
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
							path='/Game'
							element={!user ? <Login /> : <Game />}
						/>

						<Route
							path="*"
							element={<Navigate to="/" />}
						/>
					</Routes>
				</GameContextProvider>
			</ChatContextProvider>
		</div>
	);
}

export default App;

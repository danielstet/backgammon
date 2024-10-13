import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import Notification from '../Notification/Notification';
import './Navbar.css';

const Navbar = () => {
	const { user, logoutUser } = useContext(AuthContext);
	return (
		<>
			<div className="navbar">
				<div className="container">
					<h2 className="navbar-title">
						<Link
							to="/"
							className="navbar-link"
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="20px" fill='white'>
								<path d="M274.9 34.3c-28.1-28.1-73.7-28.1-101.8 0L34.3 173.1c-28.1 28.1-28.1 73.7 0 101.8L173.1 413.7c28.1 28.1 73.7 28.1 101.8 0L413.7 274.9c28.1-28.1 28.1-73.7 0-101.8L274.9 34.3zM200 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM96 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 376a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM352 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 120a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm96 328c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64l-114.3 0c11.6 36 3.1 77-25.4 105.5L320 413.8l0 34.2zM480 328a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>
							</svg>
							Backgammon
						</Link>
					</h2>
					{user && (
						<span className="navbar-user">
							Logged in as:
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" fill='white'>
            					{/* Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. */}
            					<path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/>
        					</svg>
							{user?.name}
						</span>
					)}
					<nav className="navbar-nav">
						<div className="nav-items">
							{!user ? (
								<>
									<Link
										to="/login"
										className="navbar-link"
									>
										Login
									</Link>
									<Link
										to="/register"
										className="navbar-link"
									>
										Register
									</Link>
								</>
							) : (
								<>
									<Notification />
									<Link
										to="/login"
										className="navbar-link"
										onClick={() => logoutUser()}
									>
										Logout
									</Link>
								</>
							)}
						</div>
					</nav>
				</div>
			</div>
		</>
	);
};

export default Navbar;

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
							Chat-App
						</Link>
					</h2>
					{user && (
						<span className="navbar-user">
							Logged in as {user?.name}
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

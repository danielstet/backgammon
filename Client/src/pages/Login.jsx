import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import Button from '../components/loginAndRegisterComponents/Button'
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Login.css'

const Login = () => {
	const {
		loginUser,
		loginError,
		loginInfo,
		updateLoginInfo,
		isLoginLoading,
	} = useContext(AuthContext);

	return (
		<>
		<div className="login-container">
		<div className="login-card">
			<h2 style={{ fontSize: '1.5rem' }}>Login</h2>
			<p>Enter your details to access your account</p>
			<form onSubmit={loginUser} className="login-form">
					<div>
						<label htmlFor="email" className="input-highlight">
							<FaEnvelope /> Email
						</label>
						<input
							type="email"
							id="email"
							onChange={(e) => updateLoginInfo({ ...loginInfo, email: e.target.value })}
							placeholder="example@gmail.com"
							required
						/>
					</div>
					<div>
						<label htmlFor="password" className="input-highlight">
							<FaLock /> Password
						</label>
						<input
							type="password"
							id="password"
							onChange={(e) => updateLoginInfo({ ...loginInfo, password: e.target.value })}
							required
						/>
					</div>
					<Button type="submit" className="btn create-account-btn">
						{!isLoginLoading ? 'Login' : 'Trying to login...'}
					</Button>
					{loginError?.error && (
						<div className='loginError' style={{ color: 'red' }}>
							<p>{loginError?.message}</p>
						</div>
					)}
					<p className="redirect-link">
						Don't have an account?{' '}
						<Link to="/Register" className="register-link">Register</Link>
					</p>
				</form>
		</div>
		</div>
		</>
	);
};

export default Login;

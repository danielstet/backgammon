import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

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
			<form onSubmit={loginUser}>
				<label>Login to Account</label>
				<p>2024</p>

				
				<div>
					<label>Email:</label>
					<input
						type="email"
						placeholder="example@gmail.com"
						onChange={(e) => {
							updateLoginInfo({
								...loginInfo,
								email: e.target.value,
							});
						}}
						required
					></input>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						placeholder="Abc$1234"
						onChange={(e) => {
							updateLoginInfo({
								...loginInfo,
								password: e.target.value,
							});
						}}
						required
					></input>
				</div>
				<button type="submit">
					{!isLoginLoading ? 'Login' : 'Trying to login...'}
				</button>
				{loginError?.error && (
					<div style={{ color: 'red' }}>
						<p>{loginError?.message}</p>
					</div>
				)}
			</form>
		</>
	);
};

export default Login;

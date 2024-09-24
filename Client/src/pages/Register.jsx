import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
	const {
		registerInfo,
		updateRegisterInfo,
		registerUser,
		registerError,
		isRegisterLoading,
	} = useContext(AuthContext);

	return (
		<>
			<form onSubmit={registerUser}>
				<label>Create a new Account</label>
				<p>2024</p>

				<div>
					<label>Name:</label>
					<input
						type="text"
						placeholder="Please enter a name"
						onChange={(e) => {
							updateRegisterInfo({
								...registerInfo,
								name: e.target.value,
							});
						}}
						required
					></input>
				</div>
				<div>
					<label>Email:</label>
					<input
						type="email"
						placeholder="example@gmail.com"
						onChange={(e) => {
							updateRegisterInfo({
								...registerInfo,
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
							updateRegisterInfo({
								...registerInfo,
								password: e.target.value,
							});
						}}
						required
					></input>
				</div>
				<button type="submit">
					{!isRegisterLoading ? 'Register' : 'Registering...'}
				</button>
				{registerError?.error && (
					<div style={{ color: 'red' }}>
						<p>{registerError?.message}</p>
					</div>
				)}
			</form>
		</>
	);
};

export default Register;

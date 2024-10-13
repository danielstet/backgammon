import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import Button from '../components/loginAndRegisterComponents/Button'
import { AuthContext } from '../context/AuthContext';
import './Register.css'

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
			<div className="login-container">
      <div className="login-card">
        <h2 style={{ fontSize: '1.5rem' }}>Create an account</h2>
        <p>Enter your details below to create your account</p>
    
       <form onSubmit={registerUser} className="login-form">
          <div>
            <label htmlFor="username" className="input-highlight">
              <FaUser /> Chatname
            </label>
            <input
              type="text"
              id="username"
              onChange={(e) => {
                updateRegisterInfo({
                    ...registerInfo,
                    name: e.target.value,
                });
            }}
              placeholder="Your username"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="input-highlight">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => {
                updateRegisterInfo({
                    ...registerInfo,
                    email: e.target.value,
                });
            }}
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
              placeholder="Abc$1234"
              onChange={(e) => {
                updateRegisterInfo({
                    ...registerInfo,
                    password: e.target.value,
                });
            }}
              required
            />
          </div>

          <Button type="submit" className="btn create-account-btn">
          {!isRegisterLoading ? 'Register' : 'Registering...'}
          </Button>
          {registerError?.error && (
					<div className='registerError' style={{ color: 'red' }}>
						<p>{registerError?.message}</p>
					</div>
				)}
        </form>

        <p>Already have an account? <Link to="/Login">Login</Link></p>
      </div>
    </div>
		</>
	);
};

export default Register;

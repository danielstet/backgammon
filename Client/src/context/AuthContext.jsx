import { createContext, useEffect, useCallback, useState } from 'react';
import { baseUrl, postRequest } from '../utils/apiServices';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState("" | null);

	const [registerError, setRegisterError] = useState(null);
	const [isRegisterLoading, setIsRegisterLoading] = useState(false);
	const [registerInfo, setRegisterInfo] = useState({
		name: '',
		email: '',
		password: '',
	});
	const [loginError, setloginError] = useState(null);
	const [isLoginLoading, setIsLoginLoading] = useState(false);
	const [loginInfo, setLoginInfo] = useState({
		email: '',
		password: '',
	});

	// callback functions

	// Load user from cookie when the component mounts
	// if doesnt exist it stays null
	useEffect(() => {
		const userCookie = Cookies.get('User');
		if (userCookie) {
			setUser(JSON.parse(userCookie));
		}
	}, []);

	// updates the register info that the user passes as an object from the register page
	const updateRegisterInfo = useCallback((info) => {
		setRegisterInfo(() => {
			return info;
		});
	}, []);

	// updates the login info that the user passes as an object from the login page
	const updateLoginInfo = useCallback((info) => {
		setLoginInfo(() => {
			return info;
		});
	}, []);

	// sends a fetch request to our rest api
	// if success it register a new user in database the user comes back 1 day token
	// then sets our user in a cookie
	// then sets the user
	const registerUser = useCallback(
		async (e) => {
			e.preventDefault();
			setIsRegisterLoading(true);
			setRegisterError(null);
			const response = await postRequest(
				`${baseUrl}/users/register`,
				JSON.stringify(registerInfo)
			);

			setIsRegisterLoading(false);

			if (response.error) {
				return setRegisterError(response);
			}

			Cookies.set('User', JSON.stringify(response), {
				secure: true,
				expires: 1,
			}); // expires in 1 day
			setUser(response);
		},
		[registerInfo]
	);

	// sends a fetch request to our rest api
	// if success it gets user data (the user comes back with 3 hour token lifespan) and stores it in our local storage
	// then sets the user
	const loginUser = useCallback(
		async (e) => {
			e.preventDefault();

			setIsLoginLoading(true);
			setloginError(null);

			const response = await postRequest(
				`${baseUrl}/users/login`,
				JSON.stringify(loginInfo)
			);

			setIsLoginLoading(false);

			if (response.error) {
				return setloginError(response);
			}

			Cookies.set('User', JSON.stringify(response), {
				secure: true,
				expires: 1,
			}); // expires in 1 day
			setUser(response);
		},
		[loginInfo]
	);

	// deletes the user data from the local storage
	// sets the user to be null
	const logoutUser = useCallback(() => {
		Cookies.remove('User');
		setUser(null);
	}, []);

	// in the value add all the need callback functions and state that needed in the Auth proccess
	return (
		<AuthContext.Provider
			value={{
				user,
				registerInfo,
				updateRegisterInfo,
				registerError,
				registerUser,
				isRegisterLoading,
				logoutUser,
				loginUser,
				loginError,
				loginInfo,
				updateLoginInfo,
				isLoginLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
AuthContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

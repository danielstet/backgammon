import { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import './RoomCreator.css';

const RoomCreator = () => {
	const { createPublicRoom, onlinePlayers, publicRoomError } =
		useContext(GameContext);
	// console.log('room creator component', onlinePlayers.length);

	return (
        <>
            <div className='bg'>
			<div>{`Other online Players: ${onlinePlayers.length - 1}`}</div>
			<div>
				<p>Into Public room anyone can join and see</p>
				<button onClick={() => createPublicRoom()}>
					Create A public Room
				</button>
			</div>
			{publicRoomError ? <div style={{color: 'red' }}>{publicRoomError}</div> : ''}
            </div>
		</>
	);
};

export default RoomCreator;

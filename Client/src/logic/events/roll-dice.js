import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { toastStyle } from '../../pages/GameBoard';
import ThisTurn from '../models/this-turn';

export function dice() {
	const first = Math.floor(Math.random() * 6) + 1;
	const second = Math.floor(Math.random() * 6) + 1;

	return [first, second];
}

export function rollingDice(tempTurn) {
	const thisTurn = new ThisTurn(
		tempTurn.turnPlayer,
		tempTurn.opponentPlayer,
		dice(),
		true
	);

	if (thisTurn._dices[0] === thisTurn._dices[1]) {
		toast.success(
			`${thisTurn._turnPlayer._icon}
      🎲 Rolled a double ${thisTurn._dices} 🎲`,
			toastStyle(thisTurn)
		);
	} else {
		toast.success(
			`${thisTurn._turnPlayer._icon}
      🎲 Rolled ${thisTurn._dices} 🎲`,
			toastStyle(thisTurn)
		);
	}

	return thisTurn;
}

// Define prop types for the rollingDice function
// rollingDice.propTypes = {
// 	tempTurn: PropTypes.instanceOf(ThisTurn),
// };

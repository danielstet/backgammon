import { toast } from 'react-hot-toast';
import { toastStyle } from '../../pages/GameBoard';
import Game from '../models/game';
import ThisTurn from '../models/this-turn';
import PropTypes from 'prop-types';

export function changeTurn(game, thisTurn) {
	if (game._gameOn) {
		thisTurn = changingTurn(thisTurn);
	}

	return thisTurn;
}

export function changingTurn(oldTurn) {
	console.log("Changing turn!");
	console.log("oldTurn", oldTurn);
	

	const thisTurn = new ThisTurn(
		oldTurn._opponentPlayer,
		oldTurn._turnPlayer,
		[],
		false
	);

	const message = `Turn is now ${thisTurn._turnPlayer._icon}`;
	toast.success(message, toastStyle(thisTurn));

	return thisTurn;
}

// changeTurn.propTypes = {
// 	game: PropTypes.instanceOf(Game),
// 	thisTurn: PropTypes.instanceOf(ThisTurn),
// };

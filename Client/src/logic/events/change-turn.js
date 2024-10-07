import { toast } from 'react-hot-toast';
import { toastStyle } from '../../pages/GameBoard';
import Game from '../models/game';
import ThisTurn from '../models/this-turn';
import PropTypes from 'prop-types';

export function changeTurn(game, thisTurn) {
	if (game.gameOn) {
		thisTurn = changingTurn(thisTurn);
	}

	return thisTurn;
}

export function changingTurn(oldTurn) {
	const thisTurn = new ThisTurn(
		oldTurn.opponentPlayer,
		oldTurn.turnPlayer,
		[],
		false
	);

	const message = `Turn is now ${thisTurn.turnPlayer.icon}`;
	toast.success(message, toastStyle(thisTurn));

	return thisTurn;
}

changeTurn.propTypes = {
	game: PropTypes.instanceOf(Game),
	thisTurn: PropTypes.instanceOf(ThisTurn),
};

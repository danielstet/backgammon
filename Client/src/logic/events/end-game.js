import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { toastStyle } from '../../pages/GameBoard';
import Game from '../models/game';
import ThisTurn from '../models/this-turn';

export function readyToEnd(game, thisTurn) {
	const containing = [];

	game.board.map((bar, barIdx) => {
		if (bar.includes(thisTurn.turnPlayer.name)) containing.push(barIdx);
	});

	if (thisTurn.turnPlayer.name === 'White') {
		for (let i = 0; i < containing.length; i++) {
			const barIdx = containing[i];

			if (barIdx < 18) return false;
		}
	} else {
		for (let i = 0; i < containing.length; i++) {
			const barIdx = containing[i];

			if (barIdx < 6 || barIdx > 11) return false;
		}
	}

	return true;
}

export function celebrateGameEnd(thisTurn) {
	toast(
		`${thisTurn.turnPlayer.icon} has Won the Game!`,
		toastStyle(thisTurn)
	);
}

// Define prop types for the functions
readyToEnd.propTypes = {
	game: PropTypes.instanceOf(Game),
	thisTurn: PropTypes.instanceOf(ThisTurn),
};

celebrateGameEnd.propTypes = {
	thisTurn: PropTypes.instanceOf(ThisTurn),
};

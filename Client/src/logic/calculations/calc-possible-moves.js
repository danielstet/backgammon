import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { toastStyle } from '../../pages/GameBoard';
import { changeTurn } from '../events/change-turn';
import Game from '../models/game';
import ThisTurn from '../models/this-turn';

export function checkCantMove(game, thisTurn) {
	if (game.gameOn && !hasPossibleMove(game, thisTurn)) {
		toast.error(
			`You have no possible moves.
      Turn changes to opponent.`,
			toastStyle(thisTurn)
		);

		thisTurn = changeTurn(game, thisTurn);
	}

	return thisTurn;
}

export function hasPossibleMove(game, thisTurn) {
	if (thisTurn.turnPlayer.outBar.length !== 0) {
		const canGoTo = calcGettingOutOfOutMoves(game, thisTurn);
		return canGoTo.length !== 0;
	}

	const containing = [];
	game.board.map((bar, barIdx) => {
		if (bar.includes(thisTurn.turnPlayer.name)) containing.push(barIdx);
	});

	const allMoves = [];
	containing.map((barIdx) => {
		const canGoTo = calcPossibleMoves(game, barIdx, thisTurn);
		canGoTo.map((barIdx) => allMoves.push(barIdx));
	});

	const endingDiceBars = calcEndingDiceBars(game, thisTurn);
	endingDiceBars.map((barIdx) => allMoves.push(barIdx));

	return allMoves.length !== 0;
}

export function calcPossibleMoves(game, fromBarIdx, thisTurn) {
	let [firstDice, secondDice] = thisTurn.dices;

	if (firstDice === null) firstDice = 0;
	if (secondDice === null) secondDice = 0;

	const canGoTo = [];

	for (let i = 0; i < game.board.length; i++) {
		const toBar = game.board[i];
		const toBarIdx = i;

		if (toBar.includes(thisTurn.opponentPlayer.name) && toBar.length > 1) {
			continue;
		}

		if (thisTurn.turnPlayer.name === 'White') {
			if (
				(fromBarIdx <= 11 &&
					toBarIdx <= 11 &&
					toBarIdx >= fromBarIdx) ||
				(fromBarIdx > 11 && toBarIdx > 11 && toBarIdx <= fromBarIdx) ||
				(fromBarIdx > 11 && toBarIdx < 11)
			) {
				continue;
			}
		} else {
			if (
				(fromBarIdx <= 11 &&
					toBarIdx <= 11 &&
					toBarIdx <= fromBarIdx) ||
				(fromBarIdx > 11 && toBarIdx > 11 && toBarIdx >= fromBarIdx) ||
				(fromBarIdx <= 11 && toBarIdx > 11)
			) {
				continue;
			}
		}

		let distance = 0;

		if (fromBarIdx <= 11) {
			distance =
				toBarIdx <= 11
					? Math.abs(fromBarIdx - toBarIdx)
					: fromBarIdx + (toBarIdx - 11);
		} else {
			distance =
				toBarIdx > 11
					? Math.abs(fromBarIdx - toBarIdx)
					: fromBarIdx + (toBarIdx - 11);
		}

		if (
			distance === 0 ||
			(distance !== firstDice && distance !== secondDice)
		) {
			continue;
		}

		canGoTo.push(toBarIdx);
	}

	return canGoTo;
}

export function calcGettingOutOfOutMoves(game, thisTurn) {
	function checkForOpponent(bar) {
		const opponentPlayer = thisTurn.opponentPlayer.name;
		return (
			!game.board[bar].includes(opponentPlayer) ||
			(game.board[bar].includes(opponentPlayer) &&
				game.board[bar].length === 1)
		);
	}

	const canGoTo = [];
	const [firstDice, secondDice] = thisTurn.dices;

	if (thisTurn.turnPlayer.name === 'White') {
		if (firstDice > 0 && checkForOpponent(12 - firstDice)) {
			canGoTo.push(12 - firstDice);
		}
		if (secondDice > 0 && checkForOpponent(12 - secondDice)) {
			canGoTo.push(12 - secondDice);
		}
	} else {
		if (firstDice > 0 && checkForOpponent(24 - firstDice)) {
			canGoTo.push(24 - firstDice);
		}
		if (secondDice > 0 && checkForOpponent(24 - secondDice)) {
			canGoTo.push(24 - secondDice);
		}
	}

	return canGoTo;
}

export function calcEndingDiceBars(game, thisTurn) {
	const turnPlayer = thisTurn.turnPlayer.name;

	function includesPlayer(bar) {
		return game.board[bar].includes(turnPlayer);
	}

	const canGoFrom = [];
	let [firstDice, secondDice] = thisTurn.dices;

	while (firstDice > 0 || secondDice > 0) {
		if (turnPlayer === 'White') {
			if (firstDice > 0 && includesPlayer(24 - firstDice)) {
				canGoFrom.push(24 - firstDice);
			}

			if (
				secondDice > 0 &&
				firstDice !== secondDice &&
				includesPlayer(24 - secondDice)
			) {
				canGoFrom.push(24 - secondDice);
			}
		} else {
			if (firstDice > 0 && includesPlayer(12 - firstDice)) {
				canGoFrom.push(12 - firstDice);
			}

			if (
				secondDice > 0 &&
				firstDice !== secondDice &&
				includesPlayer(12 - secondDice)
			) {
				canGoFrom.push(12 - secondDice);
			}
		}

		firstDice--;
		secondDice--;
	}
	return canGoFrom;
}

// Define PropTypes for the functions
checkCantMove.propTypes = {
	game: PropTypes.instanceOf(Game),
	thisTurn: PropTypes.instanceOf(ThisTurn),
};

hasPossibleMove.propTypes = {
	game: PropTypes.instanceOf(Game),
	thisTurn: PropTypes.instanceOf(ThisTurn),
};

calcPossibleMoves.propTypes = {
	game: PropTypes.instanceOf(Game),
	fromBarIdx: PropTypes.number,
	thisTurn: PropTypes.instanceOf(ThisTurn),
};

calcGettingOutOfOutMoves.propTypes = {
	game: PropTypes.instanceOf(Game),
	thisTurn: PropTypes.instanceOf(ThisTurn),
};

calcEndingDiceBars.propTypes = {
	game: PropTypes.instanceOf(Game),
	thisTurn: PropTypes.instanceOf(ThisTurn),
};

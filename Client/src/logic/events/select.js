import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { toastStyle } from '../../pages/GameBoard';
import { calcMovesMade } from '../calculations/calc-moves-made';
import {
	calcEndingDiceBars,
	calcGettingOutOfOutMoves,
	calcPossibleMoves,
	checkCantMove,
} from '../calculations/calc-possible-moves';
import Game from '../models/game';
import ThisMove from '../models/this-move';
import ThisTurn from '../models/this-turn';
import { changeTurn } from './change-turn';
import { readyToEnd } from './end-game';
import { movingPiece } from './moving';

export function selecting(index, game, thisTurn, thisMove) {
	console.log("selecting Func");
	console.log("index", index);
	console.log("game", game);
	console.log("thisTurn", thisTurn);
	console.log("thisMove", thisMove);
	
	
	

	const newMove = () => new ThisMove();

	if (!game._gameOn) {
		toast.error('Begin a Game first!', toastStyle(thisTurn));
		return [game, thisTurn, thisMove];
	}

	if (!thisTurn._rolledDice) {
		toast.error('Roll a dice first!', toastStyle(thisTurn));
		return [game, thisTurn, thisMove];
	}

	if (
		thisTurn._turnPlayer._outBar.length === 0 &&
		index === thisTurn._turnPlayer._outBarIdx
	) {
		toast.error('You have no pieces on out bar.', toastStyle(thisTurn));
		return [game, thisTurn, thisMove];
	}

	if (
		!thisTurn._turnPlayer._inTheEnd &&
		index === thisTurn._turnPlayer._endBarIdx
	) {
		toast.error(
			`You have not brought all your pieces to the ending area yet.`,
			toastStyle(thisTurn)
		);
		return [game, thisTurn, thisMove];
	}

	if (
		thisMove._fromBarIdx === -1 &&
		typeof index === 'number' &&
		game._board[index].length === 0
	) {
		toast.error("You can't select an empty bar.", toastStyle(thisTurn));
		return [game, thisTurn, thisMove];
	}

	if (
		typeof index === 'number' &&
		game._board[index].includes(thisTurn._opponentPlayer._name) &&
		game._board[index].length > 1
	) {
		toast.error("You can't select opponent's bar.", toastStyle(thisTurn));
		console.log(
			'thisTurn._opponentPlayer._name:',
			thisTurn._opponentPlayer._name,
			'thisTurn._turnPlayer._name:',
			thisTurn._turnPlayer._name,
			'thisTurn._rolledDice:',
			thisTurn._rolledDice,
			'thisTurn._dices:',
			thisTurn._dices
		);
		
		return [game, thisTurn, thisMove];
	}

	if (
		thisTurn._turnPlayer._outBar.length !== 0 &&
		thisMove._fromBarIdx !== thisTurn._turnPlayer._outBarIdx &&
		index !== thisTurn._turnPlayer._outBarIdx
	) {
		toast.error(
			`You have to play your out pieces first.`,
			toastStyle(thisTurn)
		);
		return [game, thisTurn, thisMove];
	}

	// Deselecting 'from'
	if (index === thisMove._fromBarIdx) {
		thisMove = newMove();
		return [game, thisTurn, thisMove];
	}

	// Setting 'from' End Bar
	if (thisMove._fromBarIdx === -1 && index === thisTurn._turnPlayer._endBarIdx) {
		thisMove = settingFromEndBar(index, game, thisTurn, thisMove);
		return [game, thisTurn, thisMove];
	}

	// Setting 'from' Out Bar
	if (
		thisTurn._turnPlayer._outBar.length !== 0 &&
		index === thisTurn._turnPlayer._outBarIdx
	) {
		thisMove = settingFromOutBar(index, game, thisTurn, thisMove);
		return [game, thisTurn, thisMove];
	}

	if (typeof index !== 'number') {
		toast.error("You can't select opponent's bar.", toastStyle(thisTurn));
		return [game, thisTurn, thisMove];
	}

	// Main Bars
	if (
		// Setting 'from' Main Bar
		thisMove._fromBarIdx === -1 &&
		game._board[index].includes(thisTurn._turnPlayer._name)
	) {
		thisMove = settingFromBar(game, index, thisTurn, thisMove);
		return [game, thisTurn, thisMove];
	} else if (
		// Setting 'to' Bar for main, out, and end moves
		thisMove._toBarIdx === -1 &&
		thisMove._canGoTo.includes(index)
	) {
		thisTurn = settingToBar(index, game, thisTurn, thisMove);
		thisMove = newMove();

		if (!thisTurn._turnPlayer._inTheEnd && readyToEnd(game, thisTurn)) {
			thisTurn._turnPlayer._inTheEnd = true;

			toast.success(
				`${thisTurn._turnPlayer._icon} 
      is in the ending area!
      Select your ending bar
      & start putting pieces out.`,
				toastStyle(thisTurn)
			);
		}

		// should happen
		if (thisTurn._maxMoves === 0) {
			thisTurn = changeTurn(game, thisTurn);
			return [game, thisTurn, thisMove];
		}

		if (thisTurn._rolledDice) {
			thisTurn = checkCantMove(game, thisTurn);
			return [game, thisTurn, thisMove];
		}
	} else {
		toast.error("You can't select there.", toastStyle(thisTurn));
		return [game, thisTurn, thisMove];
	}

	toast('Why are you here?', toastStyle(thisTurn));
	console.log("select:", thisTurn);

	return [game, thisTurn, thisMove];
}

export function settingFromBar(game, index, thisTurn, thisMove) {
	const canGoTo = calcPossibleMoves(game, index, thisTurn);

	if (canGoTo.length !== 0) {
		thisMove._fromBarIdx = index;
		thisMove._canGoTo = canGoTo;
	} else {
		toast.error("You can't select there.", toastStyle(thisTurn));
	}

	return thisMove;
}

export function settingFromOutBar(index, game, thisTurn, thisMove) {
	thisMove._fromBarIdx = index;

	const canGoTo = calcGettingOutOfOutMoves(game, thisTurn);
	thisMove._canGoTo = canGoTo;

	return thisMove;
}

export function settingFromEndBar(index, game, thisTurn, thisMove) {
	if (readyToEnd(game, thisTurn)) {
		const endingDiceBars = calcEndingDiceBars(game, thisTurn);

		if (endingDiceBars.length !== 0) {
			thisMove._fromBarIdx = index;
			thisMove._canGoTo = endingDiceBars;
			return thisMove;
		} else {
			toast.error("You can't select there.", toastStyle(thisTurn));
		}
	}

	return thisMove;
}

export function settingToBar(index, game, thisTurn, thisMove) {
	thisMove._toBarIdx = index;
	movingPiece(game, thisTurn, thisMove);

	thisTurn = calcMovesMade(thisTurn, thisMove);

	return thisTurn;
}

// Define PropTypes for the functions
// selecting.propTypes = {
// 	index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
// 	game: PropTypes.instanceOf(Game),
// 	thisTurn: PropTypes.instanceOf(ThisTurn),
// 	thisMove: PropTypes.instanceOf(ThisMove),
// };

// settingFromBar.propTypes = {
// 	game: PropTypes.instanceOf(Game),
// 	index: PropTypes.number,
// 	thisTurn: PropTypes.instanceOf(ThisTurn),
// 	thisMove: PropTypes.instanceOf(ThisMove),
// };

// settingFromOutBar.propTypes = {
// 	index: PropTypes.string,
// 	game: PropTypes.instanceOf(Game),
// 	thisTurn: PropTypes.instanceOf(ThisTurn),
// 	thisMove: PropTypes.instanceOf(ThisMove),
// };

// settingFromEndBar.propTypes = {
// 	index: PropTypes.string,
// 	game: PropTypes.instanceOf(Game),
// 	thisTurn: PropTypes.instanceOf(ThisTurn),
// 	thisMove: PropTypes.instanceOf(ThisMove),
// };

// settingToBar.propTypes = {
// 	index: PropTypes.number,
// 	game: PropTypes.instanceOf(Game),
// 	thisTurn: PropTypes.instanceOf(ThisTurn),
// 	thisMove: PropTypes.instanceOf(ThisMove),
// };

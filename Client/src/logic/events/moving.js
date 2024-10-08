import PropTypes from 'prop-types';
import Game from '../models/game';
import ThisMove from '../models/this-move';
import ThisTurn from '../models/this-turn';
import { celebrateGameEnd } from './end-game';

export function movingPiece(game, thisTurn, thisMove) {
	const [fromBarIdx, toBarIdx] = [thisMove._fromBarIdx, thisMove._toBarIdx];

	// Throwing opponent piece out
	if (game._board[toBarIdx].includes(thisTurn._opponentPlayer._name)) {
		thisTurn._opponentPlayer._outBar.push(game._board[toBarIdx].pop());

		thisTurn._opponentPlayer._inTheEnd = false;

		if (thisTurn._opponentPlayer._name === game._whitePlayer._name) {
			game._whitePlayer = thisTurn._opponentPlayer;
		} else {
			game._blackPlayer = thisTurn._opponentPlayer;
		}
	}

	// Returning an out piece
	if (fromBarIdx === thisTurn._turnPlayer._outBarIdx) {
		game._board[toBarIdx].push(thisTurn._turnPlayer._outBar.pop());

		if (thisTurn._turnPlayer._name === game._whitePlayer._name) {
			game._whitePlayer = thisTurn._turnPlayer;
		} else {
			game._blackPlayer = thisTurn._turnPlayer;
		}

		return game;
	}

	// Taking a piece out to end bar
	if (fromBarIdx === thisTurn._turnPlayer._endBarIdx) {
		thisTurn._turnPlayer._endBar.push(game._board[toBarIdx].pop());

		if (thisTurn._turnPlayer._name === game._whitePlayer._name) {
			game._whitePlayer = thisTurn._turnPlayer;
		} else {
			game._blackPlayer = thisTurn._turnPlayer;
		}

		if (thisTurn._turnPlayer._endBar.length === 15) {
			game._gameOn = false;
			celebrateGameEnd(thisTurn);
		}

		return game;
	}

	// Moving from 'from' to 'to'
	game._board[toBarIdx].push(game._board[fromBarIdx].pop());

	return game;
}

// Define prop types for the movingPiece function
// movingPiece.propTypes = {
// 	game: PropTypes.instanceOf(Game),
// 	thisTurn: PropTypes.instanceOf(ThisTurn),
// 	thisMove: PropTypes.instanceOf(ThisMove),
// };

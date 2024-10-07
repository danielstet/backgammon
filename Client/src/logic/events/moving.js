import PropTypes from 'prop-types';
import Game from '../models/game';
import ThisMove from '../models/this-move';
import ThisTurn from '../models/this-turn';
import { celebrateGameEnd } from './end-game';

export function movingPiece(game, thisTurn, thisMove) {
	const [fromBarIdx, toBarIdx] = [thisMove.fromBarIdx, thisMove.toBarIdx];

	// Throwing opponent piece out
	if (game.board[toBarIdx].includes(thisTurn.opponentPlayer.name)) {
		thisTurn.opponentPlayer.outBar.push(game.board[toBarIdx].pop());

		thisTurn.opponentPlayer.inTheEnd = false;

		if (thisTurn.opponentPlayer.name === game.whitePlayer.name) {
			game.whitePlayer = thisTurn.opponentPlayer;
		} else {
			game.blackPlayer = thisTurn.opponentPlayer;
		}
	}

	// Returning an out piece
	if (fromBarIdx === thisTurn.turnPlayer.outBarIdx) {
		game.board[toBarIdx].push(thisTurn.turnPlayer.outBar.pop());

		if (thisTurn.turnPlayer.name === game.whitePlayer.name) {
			game.whitePlayer = thisTurn.turnPlayer;
		} else {
			game.blackPlayer = thisTurn.turnPlayer;
		}

		return game;
	}

	// Taking a piece out to end bar
	if (fromBarIdx === thisTurn.turnPlayer.endBarIdx) {
		thisTurn.turnPlayer.endBar.push(game.board[toBarIdx].pop());

		if (thisTurn.turnPlayer.name === game.whitePlayer.name) {
			game.whitePlayer = thisTurn.turnPlayer;
		} else {
			game.blackPlayer = thisTurn.turnPlayer;
		}

		if (thisTurn.turnPlayer.endBar.length === 15) {
			game.gameOn = false;
			celebrateGameEnd(thisTurn);
		}

		return game;
	}

	// Moving from 'from' to 'to'
	game.board[toBarIdx].push(game.board[fromBarIdx].pop());

	return game;
}

// Define prop types for the movingPiece function
movingPiece.propTypes = {
	game: PropTypes.instanceOf(Game),
	thisTurn: PropTypes.instanceOf(ThisTurn),
	thisMove: PropTypes.instanceOf(ThisMove),
};

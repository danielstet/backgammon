import PropTypes from 'prop-types';
import ThisMove from '../models/this-move';
import ThisTurn from '../models/this-turn';

export function calcMovesMade(thisTurn, thisMove) {
	let distance = 0;
	const [fromBarIdx, toBarIdx] = [thisMove.fromBarIdx, thisMove.toBarIdx];

	if (typeof fromBarIdx === 'number') {
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
	} else {
		if (fromBarIdx === thisTurn.turnPlayer.outBarIdx) {
			distance =
				thisTurn.turnPlayer.name === 'White'
					? 12 - toBarIdx
					: 24 - toBarIdx;
		}

		if (fromBarIdx === thisTurn.turnPlayer.endBarIdx) {
			distance =
				thisTurn.turnPlayer.name === 'White'
					? 24 - toBarIdx
					: 12 - toBarIdx;
		}
	}

	thisTurn.movesMade = distance;

	if (
		thisTurn.movesMade === thisTurn.dices[0] ||
		(thisTurn.turnPlayer.inTheEnd && distance <= thisTurn.dices[0])
	) {
		thisTurn.maxMoves -= thisTurn.dices.shift();
	} else if (
		thisTurn.movesMade === thisTurn.dices[1] ||
		(thisTurn.turnPlayer.inTheEnd && distance <= thisTurn.dices[1])
	) {
		thisTurn.maxMoves -= thisTurn.dices.pop();
	}

	return thisTurn;
}

// Define PropTypes for the function
calcMovesMade.propTypes = {
	thisTurn: PropTypes.instanceOf(ThisTurn),
	thisMove: PropTypes.instanceOf(ThisMove),
};

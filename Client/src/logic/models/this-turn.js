import Player from './player';


export default class ThisTurn {
	constructor(turnPlayer, opponentPlayer, dices, beginning) {
		this._rolledDice = false;
		this._maxMoves = 0;
		this._movesMade = 0;

		this._turnPlayer = turnPlayer;
		this._opponentPlayer = opponentPlayer;
		this._dices = dices;

		if (beginning && dices.length === 2) {
			if (this._maxMoves === 0 && this._dices[0] === this._dices[1]) {
				this._dices.push(this._dices[0]);
				this._dices.push(this._dices[0]);
			}
			this._beginning = false;
			this._rolledDice = true;
			this._maxMoves = this._dices.reduce((a, b) => a + b, 0);
			this._movesMade = 0;
		} else {
			this._rolledDice = false;
			this._maxMoves = 0;
			this._movesMade = 0;
		}
	}

	static new() {
		return new ThisTurn(Player.new(), Player.new(), [], false);
	}

	get turnPlayer() {
		return this._turnPlayer;
	}

	get opponentPlayer() {
		return this._opponentPlayer;
	}

	get rolledDice() {
		return this._rolledDice;
	}

	set rolledDice(value) {
		this._rolledDice = value;
	}

	get dices() {
		return this._dices;
	}

	set dices(value) {
		this._dices = value;
	}

	get movesMade() {
		return this._movesMade;
	}

	set movesMade(value) {
		this._movesMade = value;
	}

	get maxMoves() {
		return this._maxMoves;
	}

	set maxMoves(value) {
		this._maxMoves = value;
	}

	clone() {
		const newThisTurn = new ThisTurn(
			this._turnPlayer,
			this._opponentPlayer,
			this._dices,
			false
		);

		newThisTurn.rolledDice = this._rolledDice;
		newThisTurn.maxMoves = this._maxMoves;
		newThisTurn.movesMade = this._movesMade;

		return newThisTurn;
	}
}

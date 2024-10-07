export default class Player {
	constructor(
		name,
		icon,
		outBarIdx,
		endBarIdx,
		pieceColor,
		pieceBorderColor
	) {
		this._name = name;
		this._icon = icon;
		this._outBarIdx = outBarIdx;
		this._endBarIdx = endBarIdx;
		this._pieceColor = pieceColor;
		this._pieceBorderColor = pieceBorderColor;
		this._outBar = [];
		this._endBar = [];
		this._inTheEnd = false;
	}

	static new() {
		return new Player('', '', '', '', '', '');
	}

	get name() {
		return this._name;
	}

	get icon() {
		return this._icon;
	}

	get outBar() {
		return this._outBar;
	}

	set outBar(value) {
		this._outBar = value;
	}

	get outBarIdx() {
		return this._outBarIdx;
	}

	get endBar() {
		return this._endBar;
	}

	set endBar(value) {
		this._endBar = value;
	}

	get endBarIdx() {
		return this._endBarIdx;
	}

	get inTheEnd() {
		return this._inTheEnd;
	}

	set inTheEnd(value) {
		this._inTheEnd = value;
	}

	get pieceColor() {
		return this._pieceColor;
	}

	get pieceBorderColor() {
		return this._pieceBorderColor;
	}

	clone() {
		const newPlayer = new Player(
			this._name,
			this._icon,
			this._outBarIdx,
			this._endBarIdx,
			this._pieceColor,
			this._pieceBorderColor
		);

		newPlayer.outBar = [...this.outBar];
		newPlayer.endBar = [...this.endBar];
		newPlayer.inTheEnd = this._inTheEnd;

		return newPlayer;
	}
}

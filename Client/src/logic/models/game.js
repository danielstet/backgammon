import Player from './player';



export default class Game {
	constructor(whitePlayerId, blackPlayerId) {
		// console.log('game.js created');
		
		this._gameOn = false;
		this._board = Game.initialState();
		this._whitePlayer = new Player(
			'White',
			'⚪ WHITE ⚪',
			'WhiteOutBar',
			'WhiteEndBar',
			'White',
			'1px solid black',
			whitePlayerId
		);
		this._blackPlayer = new Player(
			'Black',
			'⚫ BLACK ⚫',
			'BlackOutBar',
			'BlackEndBar',
			'Black',
			'1px solid #e9e2d6',
			blackPlayerId
		);
	}

	static new(whitePlayerId, blackPlayerId) {
		return new Game(whitePlayerId, blackPlayerId);
	}

	static initialState() {
		return [
			['White', 'White', 'White', 'White', 'White'],
			[],
			[],
			[],
			['Black', 'Black', 'Black'],
			[],
			['Black', 'Black', 'Black', 'Black', 'Black'],
			[],
			[],
			[],
			[],
			['White', 'White'],
			['Black', 'Black', 'Black', 'Black', 'Black'],
			[],
			[],
			[],
			['White', 'White', 'White'],
			[],
			['White', 'White', 'White', 'White', 'White'],
			[],
			[],
			[],
			[],
			['Black', 'Black'],
		];
	}

	get gameOn() {
		return this._gameOn;
	}

	set gameOn(value) {
		this._gameOn = value;
	}

	get board() {
		return this._board;
	}

	set board(value) {
		this._board = value;
	}

	get whitePlayer() {
		return this._whitePlayer;
	}

	set whitePlayer(value) {
		this._whitePlayer = value;
	}

	get blackPlayer() {
		return this._blackPlayer;
	}

	set blackPlayer(value) {
		this._blackPlayer = value;
	}

	clone() {
		const newGame = new Game();
		newGame.gameOn = this._gameOn;
		newGame.board = [...this._board];
		newGame.whitePlayer = this._whitePlayer.clone();
		newGame.blackPlayer = this._blackPlayer.clone();

		return newGame;
	}
}

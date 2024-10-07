import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { backgammon, startingGame } from '../logic/events/start-game';
import { rollingDice } from '../logic/events/roll-dice';
import { selecting } from '../logic/events/select';
import BoardBottom from '../components/BoardBottom';
import ThisTurn from '../logic/models/this-turn';
import Game from '../logic/models/game';
import ThisMove from '../logic/models/this-move';
import BoardTop from '../components/BoardTop';
import { checkCantMove } from '../logic/calculations/calc-possible-moves';

import './GameBoard.css'

export const toastStyle = (thisTurn) => ({
	style: {
		borderRadius: '10px',
		background: thisTurn.turnPlayer.name,
		color: thisTurn.opponentPlayer.name,
		border:
			thisTurn.turnPlayer.name === 'White'
				? '2px solid black'
				: '2px solid white',
	},
});

function GameBoard() {
	const [game, setGame] = useState(Game.new()); // Creates a new instance of class Game
	const [thisTurn, setThisTurn] = useState(ThisTurn.new()); // Initializes current turn
	const [thisMove, setThisMove] = useState(ThisMove.new()); // Initializes current move

	useEffect(() => {
		window.onload = () => backgammon(); // Toast notification with info
	}, []);

	function startGame() {
		const tempGame = Game.new();
		tempGame.gameOn = true;
		setGame(tempGame);

		const tempThisTurn = startingGame(tempGame.clone());
		setThisTurn(tempThisTurn);

		const tempThisMove = ThisMove.new();
		setThisMove(tempThisMove);
	}

	function rollDice() {
		if (thisTurn.rolledDice) {
			toast.error(
				`Play your move first
          ${thisTurn.turnPlayer.icon} 🎲 ${thisTurn.dices} 🎲`,
				toastStyle(thisTurn)
			);
			return;
		}

		let returnedThisTurn = rollingDice(thisTurn.clone());
		if (returnedThisTurn.rolledDice) {
			returnedThisTurn = checkCantMove(game, returnedThisTurn.clone());
		}

		setThisTurn(returnedThisTurn);
	}

	function select(index) {
		const [returnedGame, returnedThisTurn, returnedThisMove] = selecting(
			index,
			game.clone(),
			thisTurn.clone(),
			thisMove.clone()
		);

		setGame(returnedGame);
		setThisTurn(returnedThisTurn);
		setThisMove(returnedThisMove);
	}

	return (
		<div className='gameBoard'>
			<Toaster />
			<BoardTop
				game={game}
				thisMove={thisMove}
				select={select}
			/>
			<BoardBottom
				game={game}
				thisMove={thisMove}
				rollDice={rollDice}
				startGame={startGame}
				select={select}
			/>
		</div>
	);
}

export default GameBoard;

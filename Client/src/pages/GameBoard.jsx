import { useEffect, useState } from 'react';
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

import './GameBoard.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GameContext } from '../context/GameContext';

export const toastStyle = (thisTurn) => (
	console.log('toastStyle thisTurn:', thisTurn),
	{
		style: {
			borderRadius: '10px',
			background: thisTurn._turnPlayer._name,
			color: thisTurn._opponentPlayer._name,
			border:
				thisTurn._turnPlayer._name === 'White'
					? '2px solid black'
					: '2px solid white',
		},
	}
);

function GameBoard() {
	// AuthContext
	const { user } = useContext(AuthContext);
	// GameContext
	const {
		publicRoom,
		sendThisTurn,
		sendGame,
		sendThisMove,
		socketThisMove,
		socketGameData,
		socketThisTurn,
	} = useContext(GameContext);

	// console.log(
	// 	'publicRoom.CreatorId, publicRoom.OpponentId:',
	// 	publicRoom.CreatorId,
	// 	publicRoom.OpponentId
	// );

	// Game Hooks
	const [game, setGame] = useState(
		// Creator will be always white, Opponent will be always black
		Game.new(publicRoom.CreatorId, publicRoom.OpponentId)
	); // Creates a new instance of class Game

	const [thisTurn, setThisTurn] = useState(ThisTurn.new()); // Initializes current turn
	const [thisMove, setThisMove] = useState(ThisMove.new()); // Initializes current move

	// console.log('DOM RENDER gameBoard game:', game);

	// useEffect(() => {
	// 	window.onload = () => backgammon(); // Toast notification with info
	// }, []);
	// function sendTurnToSocket(thisTrunCopy) {
	// 	sendThisTurn(thisTrunCopy);
	// }

	// update on socket updates
	useEffect(() => {
		if (socketThisMove) {
			// console.log('USE_EFFECT sendThisMove:', socketThisMove);
			setThisMove(socketThisMove);
		}
		if (socketGameData) {
			// console.log('USE_EFFECT socketGameData:', socketGameData);
			setGame(socketGameData);
		}
		if (socketThisTurn) {
			// console.log('USE_EFFECT socketThisTurn:', socketThisTurn);
			setThisTurn(socketThisTurn);
		}
	}, [socketThisMove, socketGameData, socketThisTurn]);

	function startGame() {
		const tempGame = Game.new(publicRoom.CreatorId, publicRoom.OpponentId);
		tempGame.gameOn = true;
		setGame(tempGame);
		sendGame(tempGame);

		// const tempThisTurn = startingGame(tempGame.clone());
		const tempThisTurn = startingGame(tempGame);

		// console.log('tempThisTurn:', tempThisTurn);

		setThisTurn(tempThisTurn);
		sendThisTurn(tempThisTurn);
		// sendThisTurn(tempThisTurn)

		const tempThisMove = ThisMove.new();
		setThisMove(tempThisMove);
		sendThisMove(tempThisMove);
	}

	function rollDice() {
		if (thisTurn._rolledDice) {
			toast.error(
				`Play your move first
          ${thisTurn._turnPlayer._icon} 🎲 ${thisTurn._dices} 🎲`,
				toastStyle(thisTurn)
			);
			return;
		}

		// let returnedThisTurn = rollingDice(thisTurn.clone());
		let newThisTurn = new ThisTurn(
			thisTurn._turnPlayer,
			thisTurn._opponentPlayer,
			thisTurn._dices,
			false
		);

		newThisTurn.rolledDice = thisTurn._rolledDice;
		newThisTurn.maxMoves = thisTurn._maxMoves;
		newThisTurn.movesMade = thisTurn._movesMade;

		let returnedThisTurn = rollingDice(newThisTurn);

		if (returnedThisTurn.rolledDice) {
			// returnedThisTurn = checkCantMove(game, returnedThisTurn.clone());
			returnedThisTurn = checkCantMove(game, returnedThisTurn);
		}

		setThisTurn(returnedThisTurn);
		sendThisTurn(returnedThisTurn);
		// sendTurnToSocket(returnedThisTurn)
	}

	function select(index) {
		// const [returnedGame, returnedThisTurn, returnedThisMove] = selecting(
		// 	index,
		// 	game.clone(),
		// 	thisTurn.clone(),
		// 	thisMove.clone()
		// );

		const [returnedGame, returnedThisTurn, returnedThisMove] = selecting(
			index,
			game,
			thisTurn,
			thisMove
		);

		setGame(returnedGame);
		sendGame(returnedGame);

		setThisTurn(returnedThisTurn);
		sendThisTurn(returnedThisTurn);

		setThisMove(returnedThisMove);
		sendThisMove(returnedThisMove);
	}

	return (
		<div className="gameBoard">
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
				thisTurn={thisTurn}
			/>
		</div>
	);
}

export default GameBoard;
